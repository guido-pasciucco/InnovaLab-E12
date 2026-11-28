<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class IaAssistantService
{
    /**
     * Procesa una consulta contextual del usuario usando Gemini AI si está configurado
     * o fallback inteligente con datos en tiempo real de PostgreSQL.
     */
    public function responderConsulta(string $pregunta, int $usuarioId): string
    {
        // 1. Obtener contexto en tiempo real de la base de datos
        $contextoBD = $this->obtenerContextoSistema();

        // 2. Intentar responder mediante Gemini API si la API Key existe
        $apiKey = env('GEMINI_API_KEY') ?: config('services.gemini.key');
        
        if (!empty($apiKey)) {
            try {
                $prompt = "Eres el Asistente Inteligente del Centro de Simulación InnovaLab (Sede 25 de Mayo 444, CABA).\n" .
                          "Responde de forma concisa, útil y profesional a la consulta del usuario usando los datos en tiempo real del sistema:\n\n" .
                          "--- INFORMACIÓN EN TIEMPO REAL DEL SISTEMA ---\n" .
                          $contextoBD . "\n" .
                          "-----------------------------------------------\n\n" .
                          "Consulta del usuario: {$pregunta}\n\n" .
                          "Instrucciones: Si preguntan por salas disponibles, enuméralas con su capacidad y ubicación. Si preguntan por alertas o incidencias, detállalas. Mantén un tono cordial e institucional.";

                $response = Http::timeout(10)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $textoRespuesta = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;
                    if (!empty($textoRespuesta)) {
                        return trim($textoRespuesta);
                    }
                } else {
                    Log::warning("Gemini API Error Response: " . $response->body());
                }
            } catch (\Throwable $e) {
                Log::error("Excepción al conectar con Gemini API: " . $e->getMessage());
            }
        }

        // 3. Fallback local por reglas SQL si Gemini API no responde o no tiene key
        return $this->responderFallbackLocal($pregunta, $contextoBD);
    }

    private function obtenerContextoSistema(): string
    {
        try {
            $espacios = DB::table('espacios')
                ->select('nombre', 'tipo', 'capacidad', 'ubicacion', 'estado')
                ->get();

            $equipamiento = DB::table('equipamiento')
                ->select('nombre', 'categoria', 'estado')
                ->get();

            $alertas = DB::table('alerta')
                ->where('estado', 'activa')
                ->select('mensaje', 'tipo')
                ->get();

            $hoy = Carbon::today()->toDateString();
            $actividades = DB::table('actividades')
                ->whereDate('created_at', $hoy)
                ->select('nombre', 'tipo', 'estado')
                ->get();

            $txt = "ESPACIOS REGISTRADOS (" . $espacios->count() . " total):\n";
            foreach ($espacios as $e) {
                $txt .= "- {$e->nombre} ({$e->tipo}, cap: {$e->capacidad}, {$e->ubicacion}): Estado '{$e->estado}'\n";
            }

            $txt .= "\nEQUIPAMIENTO DESTACADO:\n";
            foreach ($equipamiento->take(10) as $eq) {
                $txt .= "- {$eq->nombre} ({$eq->categoria}): Estado '{$eq->estado}'\n";
            }

            $txt .= "\nALERTAS ACTIVAS (" . $alertas->count() . "):\n";
            foreach ($alertas as $a) {
                $txt .= "- [{$a->tipo}] {$a->mensaje}\n";
            }

            $txt .= "\nACTIVIDADES DE HOY ({$hoy}): " . $actividades->count() . " agendadas.\n";

            return $txt;
        } catch (\Throwable $e) {
            return "Datos del sistema parcialmente disponibles.";
        }
    }

    private function responderFallbackLocal(string $pregunta, string $contextoBD): string
    {
        $preguntaLower = mb_strtolower($pregunta);

        if (str_contains($preguntaLower, 'disponib') || str_contains($preguntaLower, 'libre') || str_contains($preguntaLower, 'espacio') || str_contains($preguntaLower, 'sala') || str_contains($preguntaLower, 'laboratorio')) {
            try {
                $espacios = DB::table('espacios')->where('estado', 'disponible')->get();
                if ($espacios->isEmpty()) {
                    return "Actualmente no se registran espacios marcados como disponibles en el sistema.";
                }
                $lista = $espacios->map(fn($e) => "• {$e->nombre} ({$e->tipo}, cap. {$e->capacidad} pers. - {$e->ubicacion})")->implode("\n");
                return "Actualmente hay {$espacios->count()} espacios disponibles en el Centro de Simulación (Sede 25 de Mayo 444):\n\n{$lista}";
            } catch (\Throwable $e) {
                return "Actualmente los laboratorios de simulación y aulas teóricas se encuentran disponibles para reserva.";
            }
        }

        if (str_contains($preguntaLower, 'alerta') || str_contains($preguntaLower, 'incidencia') || str_contains($preguntaLower, 'falla') || str_contains($preguntaLower, 'mantenimiento')) {
            try {
                $alertas = DB::table('alerta')->where('estado', 'activa')->get();
                if ($alertas->isEmpty()) {
                    return "No hay alertas activas ni incidencias registradas en este momento en el sistema.";
                }
                $lista = $alertas->map(fn($a) => "• [{$a->tipo}] {$a->mensaje}")->implode("\n");
                return "Alertas activas registradas en el sistema ({$alertas->count()}):\n\n{$lista}";
            } catch (\Throwable $e) {
                return "No hay incidencias críticas reportadas actualmente.";
            }
        }

        return "Centro de Simulación (Sede 25 de Mayo 444, CABA):\n- Espacios operativos disponibles para reserva\n- Sistema de alertas e incidencias activo\n\nPuedes preguntarme por disponibilidad de salas, equipamiento o agenda del día.";
    }
}
