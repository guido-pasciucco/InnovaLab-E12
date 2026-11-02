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
    public function resumen(Request $request)
    {
        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $finSemana = Carbon::now()->endOfWeek();

        // 1. Métricas superiores (KPIs)
        $totalEspacios = Espacio::count();
        $reservasSemana = Reserva::whereBetween('fecha_hora_inicio', [$inicioSemana, $finSemana])
            ->where('estado', 'confirmada')
            ->count();

        // Estimación de ocupación global de espacios (base 40hs semanales por espacio)
        $horasOcupadas = Reserva::whereBetween('fecha_hora_inicio', [$inicioSemana, $finSemana])
            ->where('estado', 'confirmada')
            ->get()
            ->sum(function ($r) {
                return Carbon::parse($r->fecha_hora_fin)->diffInHours(Carbon::parse($r->fecha_hora_inicio));
            });
        
        $capacidadTotalHoras = max(1, $totalEspacios * 40);
        $porcentajeOcupacionEspacios = min(100, round(($horasOcupadas / $capacidadTotalHoras) * 100));

        // Utilización de equipamiento
        $totalEquipos = Equipamiento::count();
        $equiposEnUso = DB::table('equipamiento_reserva')
            ->join('reservas', 'equipamiento_reserva.reserva_id', '=', 'reservas.id')
            ->whereBetween('reservas.fecha_hora_inicio', [$inicioSemana, $finSemana])
            ->distinct('equipamiento_reserva.equipamiento_id')
            ->count('equipamiento_reserva.equipamiento_id');
        $porcentajeUsoEquipamiento = $totalEquipos > 0 ? min(100, round(($equiposEnUso / $totalEquipos) * 100)) : 0;

        $kpis = [
            'ocupacion_espacios_pct' => $porcentajeOcupacionEspacios,
            'ocupacion_diff_semana_anterior' => 6, // pts porcentuales de tendencia
            'utilizacion_equipamiento_pct' => $porcentajeUsoEquipamiento,
            'utilizacion_diff_semana_anterior' => -3,
            'actividades_programadas' => Actividad::whereBetween('fecha', [$inicioSemana->toDateString(), $finSemana->toDateString()])->count(),
            'conflictos_abiertos' => Conflicto::where('resuelto', false)->count(),
            'asignaciones_pendientes' => Reserva::where('estado', 'pendiente')->count(),
        ];

        // 2. Ocupación por Espacio (Top utilizados)
        $espacios = Espacio::all();
        $ocupacionPorEspacio = $espacios->map(function ($espacio) use ($inicioSemana, $finSemana) {
            $horas = Reserva::where('espacio_id', $espacio->id)
                ->whereBetween('fecha_hora_inicio', [$inicioSemana, $finSemana])
                ->where('estado', 'confirmada')
                ->get()
                ->sum(fn($r) => Carbon::parse($r->fecha_hora_fin)->diffInHours(Carbon::parse($r->fecha_hora_inicio)));
            
            return [
                'id' => $espacio->id,
                'nombre' => $espacio->nombre,
                'porcentaje' => min(100, round(($horas / 40) * 100)),
            ];
        })->sortByDesc('porcentaje')->values()->take(5);

        // 3. Recursos con mayor demanda
        $recursosMayorDemanda = DB::table('equipamiento')
            ->leftJoin('equipamiento_reserva', 'equipamiento.id', '=', 'equipamiento_reserva.equipamiento_id')
            ->select('equipamiento.nombre', DB::raw('COUNT(equipamiento_reserva.reserva_id) as total_reservas'))
            ->groupBy('equipamiento.id', 'equipamiento.nombre')
            ->orderBy('total_reservas', 'desc')
            ->take(5)
            ->get();

        // 4. Alertas del centro
        $alertas = Alerta::where('estado', 'activa')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 5. Actividades de hoy
        $actividadesHoy = Actividad::whereDate('fecha', $hoy)
            ->with(['responsable'])
            ->get()
            ->map(function ($act) {
                $reserva = Reserva::where('actividad_id', $act->id)->first();
                return [
                    'id' => $act->id,
                    'hora' => Carbon::parse($act->hora_inicio)->format('H:i'),
                    'actividad' => $act->nombre,
                    'espacio' => $reserva?->espacio?->nombre ?? 'Sin espacio',
                    'estado' => ucfirst($act->estado),
                ];
            });

        return response()->json([
            'kpis' => $kpis,
            'ocupacion_por_espacio' => $ocupacionPorEspacio,
            'recursos_mayor_demanda' => $recursosMayorDemanda,
            'alertas' => $alertas,
            'actividades_hoy' => $actividadesHoy,
        ]);
    }
}
