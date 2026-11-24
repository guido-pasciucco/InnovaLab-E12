<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espacio;
use App\Models\Equipamiento;
use App\Models\Reserva;
use App\Models\Alerta;
use App\Models\Actividad;
use App\Models\Conflicto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * GET /api/v1/dashboard/resumen
     * KPIs principales en tiempo real para las tarjetas superiores del Dashboard
     */
    public function resumen()
    {
        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $finSemana = Carbon::now()->endOfWeek();

        // 1. Conteo global de actividades por estado (Objeto)
        $actividadesPorEstado = DB::table('actividades')
            ->select('estado', DB::raw('COUNT(*) as cantidad'))
            ->groupBy('estado')
            ->pluck('cantidad', 'estado');

        // 2. Tiempo promedio de resolución de conflictos (en horas)
        $promedioResolucion = DB::table('conflicto')
            ->select(DB::raw('ROUND(AVG(EXTRACT(EPOCH FROM (fecha_resolucion - fecha_detectado))/3600), 1) as promedio_horas_resolucion'))
            ->where('resuelto', true)
            ->whereNotNull('fecha_resolucion')
            ->value('promedio_horas_resolucion') ?? 0;

        // 3. SOLO valores escalares/numéricos dentro de $kpis
        $kpis = [
            'total_espacios' => Espacio::count(),
            'espacios_disponibles' => Espacio::where('estado', 'disponible')->count(),
            'espacios_mantenimiento' => Espacio::where('estado', 'mantenimiento')->count(),
            'reservas_hoy' => Reserva::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'confirmada')->count(),
            'reservas_semana' => Reserva::whereBetween('fecha_hora_inicio', [$inicioSemana, $finSemana])->where('estado', 'confirmada')->count(),
            'alertas_activas' => Alerta::where('estado', 'activa')->count(),
            'equipos_fuera_de_servicio' => Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])->count(),
            'promedio_horas_resolucion_conflictos' => (float)$promedioResolucion,
        ];

        $alertasRecientes = Alerta::where('estado', 'activa')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Devuelve 'actividades_por_estado' en la raíz del JSON para no romper las cards de KPIs
        return response()->json([
            'kpis' => $kpis,
            'actividades_por_estado' => $actividadesPorEstado,
            'alertas_recientes' => $alertasRecientes,
        ]);
    }

    /**
     * GET /api/v1/dashboard/ocupacion-espacios (KPI 2 Fix)
     * Porcentaje de ocupación dinámico para el mes en curso
     */
    public function ocupacionEspacios(Request $request)
    {
        // Fix KPI 2: Si no vienen fechas por QueryParam, calcula el mes en curso dinámicamente
        $fechaDesde = $request->query('fecha_desde', Carbon::now()->startOfMonth()->toDateTimeString());
        $fechaHasta = $request->query('fecha_hasta', Carbon::now()->endOfMonth()->toDateTimeString());

        // Consulta directa en PostgreSQL usando DATE_TRUNC para mes en curso
        $espaciosConOcupacion = DB::table('espacios as e')
            ->leftJoin('reserva_espacios as re', function ($join) {
                $join->on('e.id', '=', 're.espacio_id')
                     ->whereRaw("DATE_TRUNC('month', re.hora_inicio) = DATE_TRUNC('month', CURRENT_DATE)");
            })
            ->select(
                'e.id as espacio_id',
                'e.nombre',
                'e.tipo',
                DB::raw("COUNT(re.id) as total_reservas"),
                DB::raw("COALESCE(ROUND(SUM(EXTRACT(EPOCH FROM (re.hora_fin - re.hora_inicio))/3600), 1), 0) as horas_reservadas")
            )
            ->groupBy('e.id', 'e.nombre', 'e.tipo')
            ->get()
            ->map(function ($item) {
                // Capitalización para enviar legible al frontend
                $item->nombre_formateado = ucwords($item->nombre);
                
                // Estándar mensual estimado: 160 hs (8hs x 20 días)
                $disponibilidadTotal = 160;
                $item->porcentaje_ocupacion = $disponibilidadTotal > 0 
                    ? min(100, round(($item->horas_reservadas / $disponibilidadTotal) * 100, 1)) 
                    : 0;

                return $item;
            });

        return response()->json([
            'periodo' => [
                'desde' => $fechaDesde,
                'hasta' => $fechaHasta,
            ],
            'espacios_mas_utilizados' => $espaciosConOcupacion->sortByDesc('horas_reservadas')->values(),
        ]);
    }

    /**
     * GET /api/v1/dashboard/agenda-diaria (KPI 5 Mejorado)
     * Retorna la agenda del día incluyendo el nombre del espacio asignado
     */
    public function agendaDiaria()
    {
        $actividadesHoy = DB::table('actividades as a')
            ->leftJoin('espacios as e', 'a.espacio_id', '=', 'e.id')
            ->select(
                'a.id',
                'a.titulo',
                'a.tipo',
                'a.estado',
                'a.hora_inicio',
                'a.hora_fin',
                'a.espacio_id',
                DB::raw("COALESCE(e.nombre, 'Sin espacio asignado') as espacio_asignado")
            )
            ->whereDate('a.hora_inicio', Carbon::today())
            ->orderBy('a.hora_inicio', 'asc')
            ->get()
            ->map(function ($actividad) {
                if ($actividad->espacio_asignado !== 'Sin espacio asignado') {
                    $actividad->espacio_asignado = ucwords($actividad->espacio_asignado);
                }
                return $actividad;
            });

        return response()->json([
            'fecha' => Carbon::today()->toDateString(),
            'total_actividades' => $actividadesHoy->count(),
            'agenda' => $actividadesHoy,
        ]);
    }
}
