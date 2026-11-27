<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EquipamientoRequest;
use App\Http\Resources\EquipamientoResource;
use App\Models\Equipamiento;
use App\Models\EquipoHistorial;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EquipamientoController extends Controller
{
    public function index(Request $request): JsonResponse
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
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('numero_identificacion', 'like', "%{$search}%");
            });
        }

        $equipamientos = $query->with(['espacioHabitual', 'espacioActual'])->get();

        return response()->json(EquipamientoResource::collection($equipamientos));
    }

    public function store(EquipamientoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (!isset($data['espacio_actual_id']) && isset($data['espacio_habitual_id'])) {
            $data['espacio_actual_id'] = $data['espacio_habitual_id'];
        }

        $equipamiento = Equipamiento::create($data);

        return (new EquipamientoResource($equipamiento->load(['espacioHabitual', 'espacioActual'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Equipamiento $equipamiento): JsonResponse
    {
        $equipamiento->load(['espacioHabitual', 'espacioActual', 'historial']);
        return response()->json(new EquipamientoResource($equipamiento));
    }

    public function update(EquipamientoRequest $request, Equipamiento $equipamiento): JsonResponse
    {
        $estadoAnterior = $equipamiento->estado;
        $data = $request->validated();

        $equipamiento->update($data);
        $nuevoEstado = $equipamiento->estado;

        if ($request->has('estado') && $nuevoEstado !== $estadoAnterior) {
            EquipoHistorial::create([
                'equipamiento_id' => $equipamiento->id,
                'estado'          => $nuevoEstado,
                'espacio_id'      => $equipamiento->espacio_actual_id,
                'ubicacion_texto' => $equipamiento->espacioActual?->nombre ?? 'Sin espacio asignado',
                'fecha_inicio'    => now(),
                'motivo'          => $request->input('motivo', 'Cambio de estado desde API'),
            ]);

            if ($nuevoEstado === 'disponible') {
                Alerta::where('referencia_tipo', 'equipamiento')
                    ->where('referencia_id', $equipamiento->id)
                    ->whereIn('estado', ['activa', 'pendiente'])
                    ->update([
                        'estado'           => 'resuelta',
                        'fecha_resolucion' => now(),
                        'updated_at'       => now(),
                    ]);
            }

            if (in_array($nuevoEstado, ['mantenimiento', 'fuera_de_servicio'])) {
                Alerta::create([
                    'tipo'            => 'incidencia',
                    'referencia_tipo' => 'equipamiento',
                    'referencia_id'   => $equipamiento->id,
                    'mensaje'         => "El equipamiento '{$equipamiento->nombre}' cambió su estado a '{$nuevoEstado}'.",
                    'estado'          => 'activa',
                    'fecha'           => now(),
                ]);
            }
        }

        return response()->json(new EquipamientoResource($equipamiento->load(['espacioHabitual', 'espacioActual'])));
    }

    public function destroy(Equipamiento $equipamiento): JsonResponse
    {
        $equipamiento->delete();

        return response()->json(['message' => 'Equipamiento eliminado correctamente'], 200);
    }
}
