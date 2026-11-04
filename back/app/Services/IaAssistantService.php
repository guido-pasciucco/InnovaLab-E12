<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class IaAssistantService
{
    public function responderConsulta(string $pregunta, int $usuarioId): string
    {
        $contexto = $this->obtenerDatosDelSistema($pregunta);
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            Log::warning('GEMINI_API_KEY no configurada. Usando respuesta fallback.');
            return $contexto['respuesta_fallback'];
        }

        $prompt = "Sos el Asistente Inteligente del Centro de Simulación InnovaLab ( https://centrodesimulacion.bue.edu.ar ).\n"
            . "El usuario realizó la siguiente consulta: \"{$pregunta}\"\n\n"
            . "Los datos REALES extraídos de la base de datos de PostgreSQL son:\n"
            . json_encode($contexto['datos_json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n"
            . "Instrucciones de respuesta:\n"
            . "- Respondé de forma concisa, profesional y amable en español.\n"
            . "- Basate estrictamente en los datos proporcionados.\n"
            . "- Utilizá viñetas o listas si ayuda a presentar la información.";

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
                Log::error('Error Gemini HTTP ' . $response->status() . ': ' . $response->body());
            }
        } catch (\Throwable $e) {
            Log::error('Excepción Gemini API: ' . $e->getMessage());
        }

        return $contexto['respuesta_fallback'];
    }

    private function obtenerDatosDelSistema(string $pregunta): array
    {
        $preguntaLower = mb_strtolower($pregunta);

        // 1. Alertas, incidencias y conflictos
        if (str_contains($preguntaLower, 'alerta') || str_contains($preguntaLower, 'incidencia') || str_contains($preguntaLower, 'conflicto') || str_contains($preguntaLower, 'novedad')) {
            $alertas = DB::table('alerta')
                ->where('estado', 'activa')
                ->select('tipo', 'mensaje', 'fecha')
                ->get();

            $conflictos = DB::table('conflicto')
                ->where('resuelto', false)
                ->select('tipo', 'descripcion', 'fecha_detectado')
                ->get();

            $listaAlertas = $alertas->map(fn($a) => "- [" . strtoupper($a->tipo) . "] " . $a->mensaje)->implode("\n");
            if (empty($listaAlertas)) {
                $listaAlertas = "No hay alertas activas en este momento.";
            }

            return [
                'datos_json' => [
                    'alertas_activas' => $alertas,
                    'conflictos_pendientes' => $conflictos
                ],
                'respuesta_fallback' => "Actualmente hay " . $alertas->count() . " alertas activas y " . $conflictos->count() . " conflictos pendientes:\n\n" . $listaAlertas
            ];
        }

        // 2. Disponibilidad de espacios y laboratorios
        if (str_contains($preguntaLower, 'disponib') || str_contains($preguntaLower, 'libre') || str_contains($preguntaLower, 'espacio') || str_contains($preguntaLower, 'sala') || str_contains($preguntaLower, 'laboratorio')) {
            $datos = DB::table('espacios')
                ->where('estado', 'disponible')
                ->select('nombre', 'tipo', 'capacidad', 'ubicacion')
                ->get();

            $lista = $datos->map(fn($e) => "- " . $e->nombre . " (" . $e->tipo . ", cap. " . $e->capacidad . " pers. - " . $e->ubicacion . ")")->implode("\n");

            return [
                'datos_json' => $datos,
                'respuesta_fallback' => "Espacios disponibles (" . $datos->count() . "):\n\n" . $lista
            ];
        }

        // 3. Equipamiento y mantenimiento
        if (str_contains($preguntaLower, 'mantenimiento') || str_contains($preguntaLower, 'falla') || str_contains($preguntaLower, 'roto') || str_contains($preguntaLower, 'equipo') || str_contains($preguntaLower, 'simulador')) {
            $datos = DB::table('equipamiento')
                ->whereIn('estado', ['fuera_de_servicio', 'mantenimiento'])
                ->select('nombre', 'categoria', 'estado')
                ->get();

            $lista = $datos->map(fn($e) => "- " . $e->nombre . " (" . $e->categoria . ") - Estado: " . $e->estado)->implode("\n");

            return [
                'datos_json' => $datos,
                'respuesta_fallback' => "Equipamiento fuera de servicio o en mantenimiento (" . $datos->count() . "):\n\n" . (empty($lista) ? "Sin novedades de fallas." : $lista)
            ];
        }

        // 4. Agenda y actividades del día
        if (str_contains($preguntaLower, 'reserva') || str_contains($preguntaLower, 'hoy') || str_contains($preguntaLower, 'actividad') || str_contains($preguntaLower, 'agenda') || str_contains($preguntaLower, 'curso')) {
            $hoy = Carbon::today()->toDateString();
            $datos = DB::table('actividades')
                ->whereDate('fecha', $hoy)
                ->select('nombre', 'tipo', 'hora_inicio', 'hora_fin', 'estado')
                ->get();

            $lista = $datos->map(fn($a) => "- " . $a->nombre . " (" . $a->hora_inicio . " a " . $a->hora_fin . " hs)")->implode("\n");

            return [
                'datos_json' => $datos,
                'respuesta_fallback' => "Actividades programadas para hoy (" . $datos->count() . "):\n\n" . (empty($lista) ? "No hay actividades agendadas hoy." : $lista)
            ];
        }

        // 5. Caso por defecto (Resumen general)
        $resumen = [
            'total_espacios_disponibles' => DB::table('espacios')->where('estado', 'disponible')->count(),
            'total_equipos' => DB::table('equipamiento')->count(),
            'alertas_activas' => DB::table('alerta')->where('estado', 'activa')->count(),
            'conflictos_pendientes' => DB::table('conflicto')->where('resuelto', false)->count(),
        ];

        return [
            'datos_json' => $resumen,
            'respuesta_fallback' => "Centro de Simulación (25 de Mayo 444):\n- Espacios disponibles: " . $resumen['total_espacios_disponibles'] . "\n- Alertas activas: " . $resumen['alertas_activas'] . "\n- Conflictos pendientes: " . $resumen['conflictos_pendientes'] . "\n\nPuedes preguntarme por disponibilidad de salas, alertas, equipamiento o la agenda del día."
        ];
    }
}