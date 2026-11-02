<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class IaAssistantService
{
    /**
     * Procesa una consulta contextual combinando SQL estructurado con Gemini 1.5 Flash.
     */
    public function responderConsulta(string $pregunta, int $usuarioId): string
    {
        // 1. Obtener los datos reales de PostgreSQL ejecutando la query parametrizada
        $contexto = $this->obtenerDatosDelSistema($pregunta);

        // 2. Obtener la API Key desde las variables de entorno (.env / Render)
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            Log::warning('GEMINI_API_KEY no configurada. Usando respuesta fallback.');
            return $contexto['respuesta_fallback'];
        }

        // 3. Construir el prompt estructurado (Grounding)
        $prompt = "Sos el Asistente Inteligente del Centro de Simulación InnovaLab ( https://centrodesimulacion.bue.edu.ar ).\n"
            . "El usuario realizó la siguiente consulta: \"{$pregunta}\"\n\n"
            . "Los datos REALES y en tiempo real extraídos de la base de datos de PostgreSQL son:\n"
            . json_encode($contexto['datos_json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n"
            . "Instrucciones de respuesta:\n"
            . "- Respondé de forma concisa, profesional, amable y fluida en español.\n"
            . "- Basate estrictamente en los datos proporcionados sin inventar información adicional.\n"
            . "- Utilizá viñetas o listas si ayuda a presentar la información con mayor claridad.";

        // 4. Llamada a la API de Gemini 1.5 Flash usando la cabecera x-goog-api-key
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-goog-api-key' => $apiKey,
            ])->timeout(10)->post('[suspicious link removed]', [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $respuestaIa = $response->json('candidates.0.content.parts.0.text');
                if (!empty($respuestaIa)) {
                    return trim($respuestaIa);
                }
            } else {
                Log::error('Error en Gemini API HTTP ' . $response->status() . ': ' . $response->body());
            }
        } catch (\Throwable $e) {
            Log::error('Excepción al conectar con Gemini API: ' . $e->getMessage());
        }

        // Fallback seguro si falla la API o supera cuotas
        return $contexto['respuesta_fallback'];
    }

    /**
     * Mapea la pregunta contra PostgreSQL para extraer los datos verdaderos del sistema.
     */
    private function obtenerDatosDelSistema(string $pregunta): array
    {
        $preguntaLower = mb_strtolower($pregunta);

        // A. Disponibilidad de espacios y laboratorios
        if (str_contains($preguntaLower, 'disponib') || str_contains($preguntaLower, 'libre') || str_contains($preguntaLower, 'espacio') || str_contains($preguntaLower, 'sala') || str_contains($preguntaLower, 'laboratorio')) {
            $datos = DB::table('espacios')
                ->where('estado', 'disponible')
                ->select('nombre', 'tipo', 'capacidad', 'ubicacion', 'estado')
                ->get();

            return [
                'datos_json' => $datos,
                'respuesta_fallback' => "Actualmente hay " . $datos->count() . " espacios operativos disponibles en el Centro de Simulación."
            ];
        }

        // B. Estado de equipamiento, simuladores y mantenimiento
        if (str_contains($preguntaLower, 'mantenimiento') || str_contains($preguntaLower, 'falla') || str_contains($preguntaLower, 'roto') || str_contains($preguntaLower, 'equipo') || str_contains($preguntaLower, 'simulador')) {
            $equipamiento = DB::table('equipamiento')
                ->select('nombre', 'categoria', 'tipo_movilidad', 'cantidad', 'estado')
                ->get();

            $alertas = DB::table('alerta')->where('estado', 'activa')->get();

            return [
                'datos_json' => [
                    'equipamiento' => $equipamiento,
                    'alertas_activas' => $alertas
                ],
                'respuesta_fallback' => "Se registran equipos en mantenimiento o fuera de servicio. Revisar panel de alertas."
            ];
        }

        // C. Agenda y actividades del día
        if (str_contains($preguntaLower, 'reserva') || str_contains($preguntaLower, 'hoy') || str_contains($preguntaLower, 'actividad') || str_contains($preguntaLower, 'agenda') || str_contains($preguntaLower, 'curso')) {
            $hoy = Carbon::today()->toDateString();
            $datos = DB::table('actividades')
                ->whereDate('fecha', $hoy)
                ->select('nombre', 'tipo', 'hora_inicio', 'hora_fin', 'estado')
                ->get();

            return [
                'datos_json' => $datos,
                'respuesta_fallback' => "Para el día de hoy se registran " . $datos->count() . " actividades programadas."
            ];
        }

        // D. Resumen general por defecto
        $resumen = [
            'total_espacios_disponibles' => DB::table('espacios')->where('estado', 'disponible')->count(),
            'total_equipos' => DB::table('equipamiento')->count(),
            'alertas_activas' => DB::table('alerta')->where('estado', 'activa')->count(),
            'conflictos_pendientes' => DB::table('conflicto')->where('resuelto', false)->count(),
        ];

        return [
            'datos_json' => $resumen,
            'respuesta_fallback' => "El Centro de Simulación (25 de Mayo 444) cuenta con " . $resumen['total_espacios_disponibles'] . " espacios disponibles y " . $resumen['alertas_activas'] . " alertas activas."
        ];
    }
}
