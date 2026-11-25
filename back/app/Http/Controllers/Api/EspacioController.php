<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EspacioRequest;
use App\Http\Resources\EspacioResource;
use App\Models\Espacio;
use App\Models\EspacioHistorial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class EspacioController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
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

        return EspacioResource::collection($espacios);
    }

    public function store(EspacioRequest $request): JsonResponse
    {
        $espacio = Espacio::create($request->validated());

        return (new EspacioResource($espacio))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Espacio $espacio): EspacioResource
    {
        $espacio->load(['equipamientosHabituales', 'historial']);

        return new EspacioResource($espacio);
    }

    public function update(EspacioRequest $request, Espacio $espacio): EspacioResource
    {
        $estadoAnterior = $espacio->estado;
        $espacio->update($request->validated());
        $nuevoEstado = $espacio->estado;

        if ($request->has('estado') && $nuevoEstado !== $estadoAnterior) {
            // 1. Historial del espacio
            EspacioHistorial::create([
                'espacio_id'   => $espacio->id,
                'estado'       => $nuevoEstado,
                'fecha_inicio' => now(),
                'motivo'       => $request->input('motivo', 'Cambio de estado desde API'),
            ]);

            // 2. Si pasa a DISPONIBLE -> Cerrar automáticamente alertas activas del espacio
            if ($nuevoEstado === 'disponible') {
                Alerta::where('espacio_id', $espacio->id)
                    ->where('estado', 'activa')
                    ->update([
                        'estado'     => 'resuelta',
                        'updated_at' => now(),
                    ]);
            }

            // 3. Si pasa a MANTENIMIENTO o FUERA DE SERVICIO -> Crear alerta de incidencia
            if (in_array($nuevoEstado, ['mantenimiento', 'fuera_de_servicio'])) {
                Alerta::create([
                    'espacio_id' => $espacio->id,
                    'tipo'       => 'incidencia',
                    'mensaje'    => "El espacio '{$espacio->nombre}' cambió su estado a '{$nuevoEstado}'.",
                    'estado'     => 'activa',
                ]);
            }
        }

        return new EspacioResource($espacio);
    }

    public function destroy(Espacio $espacio): JsonResponse
    {
        $espacio->delete();

        return response()->json(['message' => 'Espacio eliminado correctamente'], 200);
    }
}
