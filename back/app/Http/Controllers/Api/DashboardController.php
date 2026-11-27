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
    public function resumen(): \Illuminate\Http\JsonResponse
    {
        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $finSemana = Carbon::now()->endOfWeek();

        $alertasActivas = Alerta::whereIn('estado', ['activa', 'pendiente'])->count();
        $conflictosPendientes = DB::table('conflicto')->where('resuelto', false)->count();

        $alertasConsolidadas = $alertasActivas > 0 ? $alertasActivas : $conflictosPendientes;

        $kpis = [
            'total_espacios' => Espacio::count(),
            'espacios_operativos' => Espacio::whereIn('estado', ['disponible', 'operativo'])->count(),
            'espacios_mantenimiento' => Espacio::where('estado', 'mantenimiento')->count(),
            'reservas_hoy' => Reserva::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'confirmada')->count(),
            'reservas_semana' => Reserva::whereBetween('fecha_hora_inicio', [$inicioSemana, $finSemana])->where('estado', 'confirmada')->count(),
            'alertas_activas' => $alertasConsolidadas,
            'conflictos_pendientes' => $conflictosPendientes,
            'equipos_fuera_de_servicio' => Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])->count(),
        ];

        $alertasRecientes = Alerta::with(['espacio', 'equipamiento'])
            ->whereIn('estado', ['activa', 'pendiente'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        if ($alertasRecientes->isEmpty() && $conflictosPendientes > 0) {
            $conflictos = DB::table('conflicto')
                ->where('resuelto', false)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            $alertasRecientes = $conflictos->map(function ($c) {
                return [
                    'id' => $c->id,
                    'tipo' => $c->tipo ?? 'conflicto_reserva',
                    'mensaje' => $c->descripcion ?? 'Conflicto de horario detectado',
                    'estado' => 'activa',
                    'created_at' => $c->created_at ?? $c->fecha_detectado ?? now(),
                    'espacio' => $c->espacio_id ? Espacio::find($c->espacio_id) : null,
                    'equipamiento' => $c->equipamiento_id ? Equipamiento::find($c->equipamiento_id) : null,
                ];
            });
        }

        return response()->json([
            'kpis' => $kpis,
            'alertas_recientes' => $alertasRecientes,
        ]);
    }

    public function ocupacionEspacios(Request $request): \Illuminate\Http\JsonResponse
    {
        $fechaDesde = $request->query('fecha_desde', Carbon::now()->startOfMonth()->toDateString());
        $fechaHasta = $request->query('fecha_hasta', Carbon::now()->endOfMonth()->toDateString());

        $espacios = Espacio::all();

        $reporte = $espacios->map(function ($espacio) use ($fechaDesde, $fechaHasta) {
            $reservas = Reserva::where('espacio_id', $espacio->id)
                ->whereBetween('fecha_hora_inicio', [$fechaDesde, $fechaHasta])
                ->where('estado', 'confirmada')
                ->get();

            $horas = 0;
            foreach ($reservas as $reserva) {
                $inicio = Carbon::parse($reserva->fecha_hora_inicio);
                $fin = Carbon::parse($reserva->fecha_hora_fin);
                $horas += $inicio->diffInHours($fin);
            }

            $capacidadMaximaHoras = 160;
            $porcentaje = $horas > 0 ? min(100, round(($horas / $capacidadMaximaHoras) * 100, 1)) : 0;

            return [
                'espacio_id' => $espacio->id,
                'nombre' => $espacio->nombre,
                'tipo' => $espacio->tipo,
                'total_reservas' => $reservas->count(),
                'horas_reservadas' => $horas,
                'porcentaje_ocupacion' => $porcentaje,
            ];
        });

        return response()->json([
            'periodo' => [
                'desde' => $fechaDesde,
                'hasta' => $fechaHasta,
            ],
            'espacios_mas_utilizados' => $reporte->sortByDesc('horas_reservadas')->values(),
        ]);
    }

    public function usoEquipamiento(Request $request): \Illuminate\Http\JsonResponse
    {
        $demandados = DB::table('equipamiento')
            ->leftJoin('equipamiento_reserva', 'equipamiento.id', '=', 'equipamiento_reserva.equipamiento_id')
            ->select(
                'equipamiento.id',
                'equipamiento.nombre',
                'equipamiento.numero_identificacion',
                'equipamiento.categoria',
                'equipamiento.tipo_movilidad',
                'equipamiento.estado',
                DB::raw('COUNT(equipamiento_reserva.reserva_id) as total_reservas')
            )
            ->groupBy('equipamiento.id', 'equipamiento.nombre', 'equipamiento.numero_identificacion', 'equipamiento.categoria', 'equipamiento.tipo_movilidad', 'equipamiento.estado')
            ->orderBy('total_reservas', 'desc')
            ->get();

        $critico = Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])
            ->get(['id', 'nombre', 'numero_identificacion', 'categoria', 'estado', 'updated_at']);

        return response()->json([
            'equipos_mas_demandados' => $demandados,
            'equipamiento_critico_mantenimiento' => $critico,
        ]);
    }

    public function metricasConflictos(): \Illuminate\Http\JsonResponse
    {
        $total = Alerta::count();
        $resueltos = Alerta::where('estado', 'resuelta')->count();
        $pendientes = Alerta::whereIn('estado', ['activa', 'pendiente'])->count();

        $desglose = Alerta::select('tipo', DB::raw('count(*) as cantidad'))
            ->groupBy('tipo')
            ->pluck('cantidad', 'tipo');

        return response()->json([
            'total_conflictos_detectados' => $total,
            'conflictos_resueltos' => $resueltos,
            'conflictos_pendientes' => $pendientes,
            'desglose_por_tipo' => $desglose,
        ]);
    }
}
