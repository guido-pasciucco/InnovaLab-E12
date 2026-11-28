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
     * Devuelve el payload completo consolidado para el Dashboard del Frontend:
     * - kpis
     * - alertas_recientes
     * - actividades_hoy
     * - ocupacion_espacios
     * - recursos_mayor_demanda
     */
    public function resumen(Request ): \Illuminate\Http\JsonResponse
    {
         = Carbon::today();
         = Carbon::now()->startOfWeek();
         = Carbon::now()->endOfWeek();

        // 1. KPIs principales
         = Alerta::whereIn('estado', ['activa', 'pendiente'])->count();
         = DB::table('conflicto')->where('resuelto', false)->count();

         =  > 0 ?  : ;

         = [
            'total_espacios'            => Espacio::count(),
            'espacios_operativos'       => Espacio::whereIn('estado', ['disponible', 'operativo'])->count(),
            'espacios_mantenimiento'    => Espacio::where('estado', 'mantenimiento')->count(),
            'reservas_hoy'              => Reserva::whereDate('fecha_hora_inicio', )->where('estado', 'confirmada')->count(),
            'reservas_semana'           => Reserva::whereBetween('fecha_hora_inicio', [, ])->where('estado', 'confirmada')->count(),
            'alertas_activas'           => ,
            'conflictos_pendientes'     => ,
            'equipos_fuera_de_servicio' => Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])->count(),
        ];

        // 2. Alertas Recientes
         = Alerta::with(['espacio', 'equipamiento'])
            ->whereIn('estado', ['activa', 'pendiente'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        if (->isEmpty() &&  > 0) {
             = DB::table('conflicto')
                ->where('resuelto', false)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

             = ->map(function () {
                return [
                    'id'           => ->id,
                    'tipo'         => ->tipo ?? 'conflicto_reserva',
                    'mensaje'      => ->descripcion ?? 'Conflicto de horario detectado',
                    'estado'       => 'activa',
                    'created_at'   => ->created_at ?? ->fecha_detectado ?? now(),
                    'espacio'      => ->espacio_id ? Espacio::find(->espacio_id) : null,
                    'equipamiento' => ->equipamiento_id ? Equipamiento::find(->equipamiento_id) : null,
                ];
            });
        }

        // 3. Actividades de Hoy
         = DB::table('actividades')
            ->whereDate('fecha', )
            ->orderBy('hora_inicio', 'asc')
            ->get();

        // 4. Ocupación por Espacios
         = Espacio::all();
         = ->map(function () use () {
             = Reserva::where('espacio_id', ->id)
                ->whereDate('fecha_hora_inicio', )
                ->where('estado', 'confirmada')
                ->get();

             = 0;
            foreach ( as ) {
                 = Carbon::parse(->fecha_hora_inicio);
                 = Carbon::parse(->fecha_hora_fin);
                 += ->diffInHours();
            }

             =  > 0 ? min(100, round(( / 8) * 100, 1)) : 0;

            return [
                'espacio_id'           => ->id,
                'nombre'               => ->nombre,
                'tipo'                 => ->tipo,
                'total_reservas'       => ->count(),
                'horas_reservadas'     => ,
                'porcentaje_ocupacion' => ,
            ];
        })->sortByDesc('horas_reservadas')->values();

        // 5. Recursos con Mayor Demanda / Equipos Más Demandados
         = DB::table('equipamiento')
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
            ->take(5)
            ->get();

        return response()->json([
            'kpis'                   => ,
            'alertas_recientes'      => ,
            'actividades_hoy'        => ,
            'ocupacion_espacios'     => ,
            'recursos_mayor_demanda' => ,
        ]);
    }

    public function ocupacionEspacios(Request ): \Illuminate\Http\JsonResponse
    {
         = ->query('fecha_desde', Carbon::now()->startOfMonth()->toDateString());
         = ->query('fecha_hasta', Carbon::now()->endOfMonth()->toDateString());

         = Espacio::all();

         = ->map(function () use (, ) {
             = Reserva::where('espacio_id', ->id)
                ->whereBetween('fecha_hora_inicio', [, ])
                ->where('estado', 'confirmada')
                ->get();

             = 0;
            foreach ( as ) {
                 = Carbon::parse(->fecha_hora_inicio);
                 = Carbon::parse(->fecha_hora_fin);
                 += ->diffInHours();
            }

             = 160;
             =  > 0 ? min(100, round(( / ) * 100, 1)) : 0;

            return [
                'espacio_id'           => ->id,
                'nombre'               => ->nombre,
                'tipo'                 => ->tipo,
                'total_reservas'       => ->count(),
                'horas_reservadas'     => ,
                'porcentaje_ocupacion' => ,
            ];
        });

        return response()->json([
            'periodo' => [
                'desde' => ,
                'hasta' => ,
            ],
            'espacios_mas_utilizados' => ->sortByDesc('horas_reservadas')->values(),
        ]);
    }

    public function usoEquipamiento(Request ): \Illuminate\Http\JsonResponse
    {
         = DB::table('equipamiento')
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

         = Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])
            ->get(['id', 'nombre', 'numero_identificacion', 'categoria', 'estado', 'updated_at']);

        return response()->json([
            'equipos_mas_demandados'              => ,
            'equipamiento_critico_mantenimiento' => ,
        ]);
    }

    public function metricasConflictos(): \Illuminate\Http\JsonResponse
    {
         = Alerta::count();
         = Alerta::where('estado', 'resuelta')->count();
         = Alerta::whereIn('estado', ['activa', 'pendiente'])->count();

         = Alerta::select('tipo', DB::raw('count(*) as cantidad'))
            ->groupBy('tipo')
            ->pluck('cantidad', 'tipo');

        return response()->json([
            'total_conflictos_detectados' => ,
            'conflictos_resueltos'        => ,
            'conflictos_pendientes'       => ,
            'desglose_por_tipo'           => ,
        ]);
    }
}
