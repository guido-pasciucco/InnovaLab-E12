<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actividad;
use App\Http\Requests\ActividadRequest;
use App\Http\Resources\ActividadResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActividadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Actividad::query();

        if ($request->has('estado')) {
            $query->where('estado', $request->query('estado'));
        }

        if ($request->has('tipo')) {
            $query->where('tipo', $request->query('tipo'));
        }

        if ($request->has('responsable_id')) {
            $query->where('responsable_id', $request->query('responsable_id'));
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('nombre', 'like', "%{$search}%");
        }

        $actividades = $query->with(['responsable'])->get();

        return response()->json([
            'data' => ActividadResource::collection($actividades)
        ]);
    }

    public function store(ActividadRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Mapear docente_id a responsable_id si vino con ese nombre
        if (!isset($data['responsable_id'])) {
            $data['responsable_id'] = $data['docente_id'] ?? $request->user()->id;
        }

        // Mapear cantidad_alumnos a participantes_estimados
        if (!isset($data['participantes_estimados']) && isset($data['cantidad_alumnos'])) {
            $data['participantes_estimados'] = $data['cantidad_alumnos'];
        }

        $actividad = Actividad::create($data);

        return response()->json([
            'message' => 'Actividad académica registrada exitosamente',
            'data' => new ActividadResource($actividad)
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $actividad = Actividad::with(['responsable', 'reservasEspacio', 'reservasEquipamiento'])->findOrFail($id);

        return response()->json([
            'data' => new ActividadResource($actividad)
        ]);
    }

    public function update(ActividadRequest $request, $id): JsonResponse
    {
        $actividad = Actividad::findOrFail($id);
        $actividad->update($request->validated());

        return response()->json([
            'message' => 'Actividad actualizada exitosamente',
            'data' => new ActividadResource($actividad)
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $actividad = Actividad::findOrFail($id);
        $actividad->delete();

        return response()->json([
            'message' => 'Actividad eliminada exitosamente'
        ]);
    }
}
