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
                $q->where('espacio_habitual_id', $espacioId);
                if (in_array('espacio_actual_id', (new Equipamiento)->getFillable())) {
                    $q->orWhere('espacio_actual_id', $espacioId);
                }
            });
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('nombre', 'like', "%{$search}%");
        }

        $equipamientos = $query->with(['espacioHabitual'])->get();

        return response()->json([
            'data' => EquipamientoResource::collection($equipamientos)
        ]);
    }

    public function store(EquipamientoRequest $request): JsonResponse
    {
        $data = $request->validated();

        $equipamiento = Equipamiento::create($data);

        return response()->json([
            'message' => 'Equipamiento creado correctamente',
            'data' => new EquipamientoResource($equipamiento->load(['espacioHabitual']))
        ], 201);
    }

    public function show(Equipamiento $equipamiento): JsonResponse
    {
        $equipamiento->load(['espacioHabitual', 'historial']);

        return response()->json([
            'data' => new EquipamientoResource($equipamiento)
        ]);
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
                'fecha_inicio'    => now(),
                'motivo'          => $request->input('motivo', 'Cambio de estado desde API'),
            ]);

            if ($nuevoEstado === 'disponible') {
                Alerta::where(function($q) use ($equipamiento) {
                    $q->where('equipamiento_id', $equipamiento->id)
                      ->orWhere(function($q2) use ($equipamiento) {
                          $q2->where('referencia_tipo', 'equipamiento')
                             ->where('referencia_id', $equipamiento->id);
                      });
                })
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

        return response()->json([
            'message' => 'Equipamiento actualizado correctamente',
            'data' => new EquipamientoResource($equipamiento->load(['espacioHabitual']))
        ]);
    }

    public function destroy(Equipamiento $equipamiento): JsonResponse
    {
        $equipamiento->delete();

        return response()->json([
            'message' => 'Equipamiento eliminado correctamente',
        ]);
    }
}
