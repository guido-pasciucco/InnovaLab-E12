<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EspacioRequest;
use App\Http\Resources\EspacioResource;
use App\Models\Espacio;
use App\Models\EspacioHistorial;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EspacioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Espacio::query();

        if ($request->has('estado')) {
            $query->where('estado', $request->query('estado'));
        }

        if ($request->has('tipo')) {
            $query->where('tipo', $request->query('tipo'));
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('ubicacion', 'like', "%{$search}%");
            });
        }

        $espacios = $query->with(['equipamientosHabituales'])->get();

        return response()->json([
            'data' => EspacioResource::collection($espacios)
        ]);
    }

    public function store(EspacioRequest $request): JsonResponse
    {
        $espacio = Espacio::create($request->validated());

        EspacioHistorial::create([
            'espacio_id'   => $espacio->id,
            'estado'       => $espacio->estado,
            'fecha_inicio' => now(),
            'motivo'       => 'Alta inicial del espacio',
        ]);

        return response()->json([
            'message' => 'Espacio creado correctamente',
            'data' => new EspacioResource($espacio)
        ], 201);
    }

    public function show(Espacio $espacio): JsonResponse
    {
        $espacio->load(['equipamientosHabituales', 'historial']);

        return response()->json([
            'data' => new EspacioResource($espacio)
        ]);
    }

    public function update(EspacioRequest $request, Espacio $espacio): JsonResponse
    {
        $estadoAnterior = $espacio->estado;
        $espacio->update($request->validated());
        $nuevoEstado = $espacio->estado;

        if ($request->has('estado') && $nuevoEstado !== $estadoAnterior) {
            EspacioHistorial::create([
                'espacio_id'   => $espacio->id,
                'estado'       => $nuevoEstado,
                'fecha_inicio' => now(),
                'motivo'       => $request->input('motivo', 'Cambio de estado desde API'),
            ]);

            if ($nuevoEstado === 'disponible') {
                Alerta::where(function($q) use ($espacio) {
                    $q->where('espacio_id', $espacio->id)
                      ->orWhere(function($q2) use ($espacio) {
                          $q2->where('referencia_tipo', 'espacio')
                             ->where('referencia_id', $espacio->id);
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
                    'referencia_tipo' => 'espacio',
                    'referencia_id'   => $espacio->id,
                    'espacio_id'      => $espacio->id,
                    'mensaje'         => "El espacio '{$espacio->nombre}' cambió su estado a '{$nuevoEstado}'.",
                    'estado'          => 'activa',
                    'fecha'           => now(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Espacio actualizado correctamente',
            'data' => new EspacioResource($espacio)
        ]);
    }

    public function destroy(Espacio $espacio): JsonResponse
    {
        $espacio->delete();

        return response()->json([
            'message' => 'Espacio eliminado correctamente',
        ]);
    }
}
