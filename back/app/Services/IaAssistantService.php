<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IaAssistantService
{
    /**
     * Procesa una consulta contextual del usuario ejecutando queries SQL estructuradas
     * conectadas a la base de datos de PostgreSQL en tiempo real.
     */
    public function responderConsulta(string $pregunta, int $usuarioId): string
    {
        $preguntaLower = mb_strtolower($pregunta);

        // 1. Disponibilidad de espacios y laboratorios
        if (str_contains($preguntaLower, 'disponib') || str_contains($preguntaLower, 'libre') || str_contains($preguntaLower, 'espacio') || str_contains($preguntaLower, 'sala') || str_contains($preguntaLower, 'laboratorio')) {
            $espaciosOperativos = DB::table('espacios')
                ->where('estado', 'disponible')
                ->select('nombre', 'tipo', 'capacidad', 'ubicacion')
                ->get();

            $total = $espaciosOperativos->count();

            if ($total === 0) {
                return "Actualmente no se registran espacios marcados como disponibles en el sistema.";
            }

            $lista = $espaciosOperativos->take(5)->map(fn($e) => "• {$e->nombre} ({$e->tipo}, cap. {$e->capacidad} pers. - {$e->ubicacion})")->implode("\n");

            return "Actualmente hay {$total} espacios operativos y disponibles en el Centro de Simulación (Sede 25 de Mayo 444):\n\n{$lista}\n\n¿Querés consultar por un horario específico o realizar una reserva?";
        }

        // 2. Estado de equipamiento, simuladores, fallas o mantenimiento
        if (str_contains($preguntaLower, 'mantenimiento') || str_contains($preguntaLower, 'falla') || str_contains($preguntaLower, 'roto') || str_contains($preguntaLower, 'fuera de servicio') || str_contains($preguntaLower, 'equipo') || str_contains($preguntaLower, 'simulador')) {
            $equiposFalla = DB::table('equipamiento')
                ->whereIn('estado', ['fuera_de_servicio', 'mantenimiento'])
                ->select('nombre', 'categoria', 'estado')
                ->get();

            $alertasActivas = DB::table('alerta')
                ->where('estado', 'activa')
                ->count();

            if ($equiposFalla->isEmpty()) {
                return "Todo el equipamiento y simuladores del centro se encuentran en estado disponible sin fallas notificadas. Actualmente hay {$alertasActivas} alertas activas registradas.";
            }

            $detalles = $equiposFalla->map(fn($e) => "• {$e->nombre} ({$e->categoria}) - Estado: {$e->estado}")->implode("\n");

            return "Se registran {$equiposFalla->count()} equipos con novedades técnicas o fuera de servicio:\n\n{$detalles}\n\nHay {$alertasActivas} alertas activas registradas en el panel de control.";
        }

        // 3. Actividades y agenda programada
        if (str_contains($preguntaLower, 'reserva') || str_contains($preguntaLower, 'hoy') || str_contains($preguntaLower, 'actividad') || str_contains($preguntaLower, 'agenda') || str_contains($preguntaLower, 'curso')) {
            $hoy = Carbon::today()->toDateString();
            
            $actividadesHoy = DB::table('actividades')
                ->whereDate('fecha', $hoy)
                ->select('nombre', 'tipo', 'hora_inicio', 'hora_fin', 'estado')
                ->get();

            if ($actividadesHoy->isEmpty()) {
                return "Para el día de hoy no hay actividades o prácticas agendadas. Se pueden programar reservas desde el panel operativo.";
            }

            $lista = $actividadesHoy->map(fn($a) => "• {$a->nombre} ({$a->tipo}) de {$a->hora_inicio} a {$a->hora_fin} hs - Estado: {$a->estado}")->implode("\n");

            return "Agenda para el día de hoy ({$hoy}):\n\n{$lista}";
        }

        // 4. Conflictos de horarios, solapamientos e incidencias
        if (str_contains($preguntaLower, 'conflicto') || str_contains($preguntaLower, 'alerta') || str_contains($preguntaLower, 'solapamiento') || str_contains($preguntaLower, 'incidencia')) {
            $conflictosSinResolver = DB::table('conflicto')
                ->where('resuelto', false)
                ->count();

            $alertas = DB::table('alerta')
                ->where('estado', 'activa')
                ->select('mensaje', 'tipo')
                ->get();

            $resumenAlertas = $alertas->map(fn($al) => "• [{$al->tipo}] {$al->mensaje}")->implode("\n");

            return "Informe de Incidencias Operativas:\n• Conflictos pendientes de resolución: {$conflictosSinResolver}\n• Alertas activas en el sistema:\n{$resumenAlertas}";
        }

        // 5. Demanda y métricas de utilización (Integración Power BI / Analytics)
        if (str_contains($preguntaLower, 'demanda') || str_contains($preguntaLower, 'mas usado') || str_contains($preguntaLower, 'métrica') || str_contains($preguntaLower, 'ranking') || str_contains($preguntaLower, 'power bi') || str_contains($preguntaLower, 'estadística')) {
            $topEquipos = DB::table('equipamiento as eq')
                ->leftJoin('reserva_equipamiento as req', 'req.equipamiento_id', '=', 'eq.id')
                ->select('eq.nombre', 'eq.categoria', DB::raw('COUNT(req.id) as total_reservas'))
                ->groupBy('eq.id', 'eq.nombre', 'eq.categoria')
                ->orderByDesc('total_reservas')
                ->limit(5)
                ->get();

            $ranking = $topEquipos->map(fn($e, $idx) => ($idx + 1) . ". {$e->nombre} ({$e->categoria}): {$e->total_reservas} reservas")->implode("\n");

            return "Métricas de Demanda e Infraestructura (Power BI Analytics):\n\n{$ranking}";
        }

        // Respuesta genérica contextual
        return "Hola. Soy el Asistente Inteligente de InnovaLab (Centro de Simulación de CABA, 25 de Mayo 444).\n\nPuedo responderte sobre:\n1. Disponibilidad de espacios y laboratorios (autoelevadores, maquinaria pesada, transporte).\n2. Estado de equipamiento, mantenimientos y alertas técnicas.\n3. Agenda de actividades y reservas programadas.\n4. Métricas de demanda e incidencias.\n\n¿En qué puedo ayudarte?";
    }
}
