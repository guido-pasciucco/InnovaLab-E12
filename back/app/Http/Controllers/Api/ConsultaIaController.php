<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class IaAssistantService
{
    /**
     * Procesa la consulta del usuario inyectando el contexto real de la BD en Gemini 1.5 Flash.
     */
    public function responderConsulta(string $pregunta, int $usuarioId): string
    {
        // 1. Extraer datos reales y actualizados de la Base de Datos
        $contextoBd = $this->obtenerContextoRealBD();

        // 2. Construir el Prompt con restricción de contexto (Grounding)
        $prompt = "Sos el Asistente Inteligente oficial de InnovaLab (Centro de Simulación de CABA, Sede 25 de Mayo 444).\n";
        $prompt .= "El usuario realizó la siguiente consulta: \"{$pregunta}\"\n\n";
        $prompt .= "Los datos REALES y actualizados en tiempo real del sistema son:\n";
        $prompt .= json_encode($contextoBd, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n\n";
        $prompt .= "Instrucciones de respuesta:\n";
        $prompt .= "- Respondé de forma concisa, profesional, amable y fluida en español.\n";
        $prompt .= "- Basate estrictamente en los datos del JSON proporcionado. Si no tenés información sobre lo que pregunta, decilo amablemente.\n";
        $prompt .= "- Utilizá viñetas o listas si ayuda a presentar los espacios o equipos claramente.";

        // 3. Llamar a la API de Gemini
        $apiKey = config('services.gemini.key', env('GEMINI_API_KEY'));
        $model = config('services.gemini.model', 'gemini-1.5-flash');

        if (empty($apiKey)) {
            Log::warning('GEMINI_API_KEY no configurada. Retornando respuesta fallback.');
            return "Hola. Actualmente el módulo de IA no tiene configurada la API Key en el entorno.";
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

            $response = Http::withHeaders([
                'x-goog-api-key' => $apiKey,
                'Content-Type'   => 'application/json',
            ])
            ->timeout(15)
            ->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] 
                    ?? "No pude procesar la respuesta en este momento.";
            }

            Log::error("Error en API Gemini: " . $response->body());
            return "Lo siento, ocurrió un error al consultar el servicio de Inteligencia Artificial.";

        } catch (\Exception $e) {
            Log::error("Excepción en IaAssistantService: " . $e->getMessage());
            return "El servicio de IA no se encuentra disponible momentáneamente.";
        }
    }

    /**
     * Obtiene una foto compacta del estado del Centro de Simulación para la IA.
     */
    private function obtenerContextoRealBD(): array
    {
        return [
            'fecha_actual' => Carbon::now()->toDateTimeString(),
            'espacios' => DB::table('espacios')
                ->select('id', 'nombre', 'tipo', 'capacidad', 'ubicacion', 'estado')
                ->get(),
            'equipamiento_fuera_servicio' => DB::table('equipamiento')
                ->whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])
                ->select('nombre', 'categoria', 'estado')
                ->get(),
            'actividades_hoy' => DB::table('actividades')
                ->whereDate('hora_inicio', Carbon::today())
                ->select('titulo', 'tipo', 'estado', 'hora_inicio', 'hora_fin')
                ->get(),
            'alertas_activas' => DB::table('alerta')
                ->where('estado', 'activa')
                ->select('mensaje', 'tipo')
                ->get(),
        ];
    }
}
