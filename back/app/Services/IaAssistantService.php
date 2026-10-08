<?php

namespace App\Services;

use App\Models\Espacio;
use App\Models\Equipamiento;
use App\Models\Reserva;

class IaAssistantService
{
    /**
     * Procesa una consulta contextual del usuario utilizando el estado actual del centro de simulación.
     */
    public function responderConsulta(string $pregunta, int $usuarioId): string
    {
        $preguntaLower = mb_strtolower($pregunta);

        // Respuestas contextualmente simuladas basadas en datos reales del sistema
        if (str_contains($preguntaLower, 'disponib') || str_contains($preguntaLower, 'libre')) {
            $espaciosLibres = Espacio::where('estado', 'disponible')->count();
            return "Actualmente hay {$espaciosLibres} espacios operativos y disponibles para reserva. ¿Deseás consultar por algún horario o equipamiento específico?";
        }

        if (str_contains($preguntaLower, 'mantenimiento') || str_contains($preguntaLower, 'falla') || str_contains($preguntaLower, 'roto')) {
            $mantenimientoCount = Equipamiento::where('estado', 'mantenimiento')->count();
            return "Se registran {$mantenimientoCount} equipamientos en mantenimiento en este momento. Podés revisar el panel de Alertas para ver las incidencias técnicas.";
        }

        if (str_contains($preguntaLower, 'reserva') || str_contains($preguntaLower, 'hoy')) {
            $reservasHoy = Reserva::whereDate('fecha_hora_inicio', now()->toDateString())->count();
            return "Para el día de hoy hay {$reservasHoy} actividades/reservas programadas en el Centro de Simulación.";
        }

        return "Hola. Soy el asistente inteligente de InnovaLab. Puedo ayudarte a verificar disponibilidad de salas, revisar estado de equipamiento o consultar las normas de uso del centro. ¿En qué puedo asistirte?";
    }
}