<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espacio;
use App\Models\Equipamiento;
use App\Models\Reserva;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * GET /api/v1/dashboard/resumen
     * KPIs principales en tiempo real
     */
    public function resumen()
    {
        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $finSemana = Carbon::now()->endOfWeek();

        $kpis = [
            'total_espacios' => Espacio::count(),
            'espacios_operativos' => Espacio::where('estado', 'operativo')->count(),
            'espacios_mantenimiento' => Espacio::where('estado', 'mantenimiento')->count(),
            'reservas_hoy' => Reserva::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'confirmada')->count(),
            'reservas_semana' => Reserva::whereBetween('fecha_hora_inicio', [$inicioSemana, $finSemana])->where('estado', 'confirmada')->count(),
            'alertas_activas' => Alerta::where('estado', 'activa')->count(),
            'equipos_fuera_de_servicio' => Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])->count(),
        ];

        $alertasRecientes = Alerta::where('estado', 'activa')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'kpis' => $kpis,
            'alertas_recientes' => $alertasRecientes,
        ]);
    }

    /**
     * GET /api/v1/dashboard/ocupacion-espacios
     * Horas de uso y porcentaje de ocupación por espacio
     */
    public function ocupacionEspacios(Request $request)
    {
        $fechaDesde = $request->query('fecha_desde', Carbon::now()->startOfMonth()->toDateString());
        $fechaHasta = $request->query('fecha_hasta', Carbon::now()->endOfMonth()->toDateString());

        $espacios = Espacio::all();

        $desglose = $espacios->map(function ($espacio) use ($fechaDesde, $fechaHasta) {
            $reservas = Reserva::where('espacio_id', $espacio->id)
                ->whereBetween('fecha_hora_inicio', [$fechaDesde, $fechaHasta])
                ->where('estado', 'confirmada')
                ->get();

            $horasReservadas = 0;
            foreach ($reservas as $r) {
                $inicio = Carbon::parse($r->fecha_hora_inicio);
                $fin = Carbon::parse($r->fecha_hora_fin);
                $horasReservadas += $fin->diffInHours($inicio);
            }

            // Estimación estándar: 160 horas mensuales de disponibilidad laboral
            $disponibilidadTotal = 160; 
            $porcentaje = $disponibilidadTotal > 0 ? min(100, round(($horasReservadas / $disponibilidadTotal) * 100, 1)) : 0;

            return [
                'espacio_id' => $espacio->id,
                'nombre' => $espacio->nombre,
                'tipo' => $espacio->tipo,
                'total_reservas' => $reservas->count(),
                'horas_reservadas' => $horasReservadas,
                'porcentaje_ocupacion' => $porcentaje,
            ];
        });

        return response()->json([
            'periodo' => [
                'desde' => $fechaDesde,
                'hasta' => $fechaHasta,
            ],
            'espacios_mas_utilizados' => $desglose->sortByDesc('horas_reservadas')->values(),
        ]);
    }

    /**
     * GET /api/v1/dashboard/uso-equipamiento
     * Demanda de equipos y detección de equipos críticos en mantenimiento
     */
    public function usoEquipamiento(Request $request)
    {
        $equiposDemandados = DB::table('equipamiento')
            ->leftJoin('equipamiento_reserva', 'equipamiento.id', '=', 'equipamiento_reserva.equipamiento_id')
            ->select(
                'equipamiento.id',
                'equipamiento.nombre',
                'equipamiento.categoria',
                'equipamiento.tipo_movilidad',
                'equipamiento.estado',
                DB::raw('COUNT(equipamiento_reserva.reserva_id) as total_reservas')
            )
            ->groupBy('equipamiento.id', 'equipamiento.nombre', 'equipamiento.categoria', 'equipamiento.tipo_movilidad', 'equipamiento.estado')
            ->orderBy('total_reservas', 'desc')
            ->get();

        $equipamientoCritico = Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])
            ->get(['id', 'nombre', 'categoria', 'estado', 'updated_at']);

        return response()->json([
            'equipos_mas_demandados' => $equiposDemandados,
            'equipamiento_critico_mantenimiento' => $equipamientoCritico,
        ]);
    }

    /**
     * GET /api/v1/dashboard/metricas-conflictos
     * Tasa de solapamientos e incidencias registradas
     */
    public function metricasConflictos()
    {
        $totalAlertas = Alerta::whereIn('tipo', ['conflicto_reserva', 'incidencia'])->count();
        $resueltas = Alerta::whereIn('tipo', ['conflicto_reserva', 'incidencia'])->where('estado', 'resuelta')->count();
        $pendientes = Alerta::whereIn('tipo', ['conflicto_reserva', 'incidencia'])->where('estado', 'activa')->count();

        $desglose = Alerta::select('tipo', DB::raw('count(*) as cantidad'))
            ->groupBy('tipo')
            ->pluck('cantidad', 'tipo');

        return response()->json([
            'total_conflictos_detectados' => $totalAlertas,
            'conflictos_resueltos' => $resueltas,
            'conflictos_pendientes' => $pendientes,
            'desglose_por_tipo' => $desglose,
        ]);
    }
}