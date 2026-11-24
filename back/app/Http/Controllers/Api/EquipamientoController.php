<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EquipamientoRequest;
use App\Http\Resources\EquipamientoResource;
use App\Models\Equipamiento;
use App\Models\EquipoHistorial;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class EquipamientoController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Equipamiento::query();

        if ($request->has('estado')) {
            $query->where('estado', $request->query('estado'));
        }

        if ($request->has('categoria')) {
            $query->where('categoria', $request->query('categoria'));
        }

        if ($request->has('tipo_movilidad')) {
            $query->where('tipo_movilidad', $request->query('tipo_movilidad'));
        }

        if ($request->has('espacio_id')) {
            $espacioId = $request->query('espacio_id');
            $query->where(function ($q) use ($espacioId) {
                $q->where('espacio_habitual_id', $espacioId)
                  ->orWhere('espacio_actual_id', $espacioId);
            });
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('nombre', 'like', "%{$search}%");
        }

        $equipamientos = $query->with(['espacioHabitual', 'espacioActual'])->get();

        return EquipamientoResource::collection($equipamientos);
    }

    public function store(EquipamientoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (!isset($data['espacio_actual_id']) && isset($data['espacio_habitual_id'])) {
            $data['espacio_actual_id'] = $data['espacio_habitual_id'];
        }

        $equipamiento = Equipamiento::create($data);

        // Si se crea directamente en mantenimiento o fuera de servicio, generar alerta activa
        if (in_array($equipamiento->estado, ['mantenimiento', 'fuera_de_servicio'])) {
            Alerta::create([
                'equipamiento_id' => $equipamiento->id,
                'espacio_id'      => $equipamiento->espacio_actual_id ?? $equipamiento->espacio_habitual_id,
                'tipo'            => 'incidencia',
                'mensaje'         => "El equipo '{$equipamiento->nombre}' fue registrado en estado '{$equipamiento->estado}'.",
                'estado'          => 'activa',
            ]);
        }

        return (new EquipamientoResource($equipamiento->load(['espacioHabitual', 'espacioActual'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Equipamiento $equipamiento): EquipamientoResource
    {
        $equipamiento->load(['espacioHabitual', 'espacioActual', 'historial']);

        return new EquipamientoResource($equipamiento);
    }

    public function update(EquipamientoRequest $request, Equipamiento $equipamiento): EquipamientoResource
    {
        $estadoAnterior = $equipamiento->estado;
        $data = $request->validated();

        $equipamiento->update($data);
        $nuevoEstado = $equipamiento->estado;

        if ($request->has('estado') && $nuevoEstado !== $estadoAnterior) {
            // 1. Registrar entrada en el historial del equipo
            EquipoHistorial::create([
                'equipamiento_id' => $equipamiento->id,
                'estado'          => $nuevoEstado,
                'espacio_id'      => $equipamiento->espacio_actual_id,
                'ubicacion_texto' => $equipamiento->espacioActual?->nombre ?? 'Sin espacio asignado',
                'fecha_inicio'    => now(),
                'motivo'          => $request->input('motivo', 'Cambio de estado desde API'),
            ]);

            // 2. Si pasa a DISPONIBLE -> Resolver automáticamente todas las alertas activas asociadas
            if ($nuevoEstado === 'disponible') {
                Alerta::where('equipamiento_id', $equipamiento->id)
                    ->where('estado', 'activa')
                    ->update([
                        'estado'     => 'resuelta',
                        'updated_at' => now(),
                    ]);
            }

            // 3. Si pasa a MANTENIMIENTO o FUERA DE SERVICIO -> Crear alerta activa de incidencia
            if (in_array($nuevoEstado, ['mantenimiento', 'fuera_de_servicio'])) {
                Alerta::create([
                    'equipamiento_id' => $equipamiento->id,
                    'espacio_id'      => $equipamiento->espacio_actual_id ?? $equipamiento->espacio_habitual_id,
                    'tipo'            => 'incidencia',
                    'mensaje'         => "El equipo '{$equipamiento->nombre}' cambió su estado a '{$nuevoEstado}'.",
                    'estado'          => 'activa',
                ]);
            }
        }

        return new EquipamientoResource($equipamiento->load(['espacioHabitual', 'espacioActual']));
    }

    public function destroy(Equipamiento $equipamiento): JsonResponse
    {
        $equipamiento->delete();

        return response()->json(['message' => 'Equipamiento eliminado correctamente'], 200);
    }
}