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
     * KPIs principales en tiempo real para el Dashboard principal.
     */
    public function resumen(): \Illuminate\Http\JsonResponse
    {
        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $finSemana = Carbon::now()->endOfWeek();

        // 1. Conteo de alertas activas
        $alertasActivasCount = Alerta::where('estado', 'activa')->count();
        
        // 2. Conteo de conflictos pendientes en la tabla 'conflicto'
        $conflictosPendientesCount = DB::table('conflicto')->where('resuelto', false)->count();

        $kpis = [
            'total_espacios' => Espacio::count(),
            // Soporta tanto 'disponible' (seeders/base CABA) como 'operativo'
            'espacios_operativos' => Espacio::whereIn('estado', ['disponible', 'operativo'])->count(),
            'espacios_mantenimiento' => Espacio::where('estado', 'mantenimiento')->count(),
            'reservas_hoy' => Reserva::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'confirmada')->count(),
            'reservas_semana' => Reserva::whereBetween('fecha_hora_inicio', [$inicioSemana, $finSemana])->where('estado', 'confirmada')->count(),
            'alertas_activas' => $alertasActivasCount,
            'conflictos_pendientes' => $conflictosPendientesCount,
            'equipos_fuera_de_servicio' => Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])->count(),
        ];

        // Se inyectan las relaciones 'espacio' y 'equipamiento' para que el Front muestre los nombres sin ser undefined
        $alertasRecientes = Alerta::with(['espacio', 'equipamiento'])
            ->where('estado', 'activa')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'kpis' => $kpis,
            'alertas_recientes' => $alertasRecientes,
        ]);
    }

    /**
     * GET /api/v1/dashboard/ocupacion-espacios
     */
    public function ocupacionEspacios(Request $request): \Illuminate\Http\JsonResponse
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
     */
    public function usoEquipamiento(Request $request): \Illuminate\Http\JsonResponse
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
     */
    public function metricasConflictos(): \Illuminate\Http\JsonResponse
    {
        $totalAlertas = Alerta::count();
        $resueltas = Alerta::where('estado', 'resuelta')->count();
        $pendientes = Alerta::where('estado', 'activa')->count();

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
