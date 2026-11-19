<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerta;
use App\Http\Requests\AlertaRequest;
use App\Http\Resources\AlertaResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AlertaController extends Controller
{
    /**
     * Listado de alertas con filtros de estado y tipo.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Alerta::query();

        if ($request->has('estado')) {
            $query->where('estado', $request->query('estado'));
        } else {
            // Muestra alertas 'activa' primero
            $query->orderByRaw("CASE WHEN estado = 'activa' THEN 1 WHEN estado = 'resuelta' THEN 2 ELSE 3 END");
        }

        if ($request->has('tipo')) {
            $query->where('tipo', $request->query('tipo'));
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('mensaje', 'like', "%{$search}%");
        }

        $alertas = $query->latest()->get();

        return response()->json([
            'data' => AlertaResource::collection($alertas)
        ]);
    }

    /**
     * Reportar manualmente una nueva alerta o incidencia.
     */
    public function store(AlertaRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['fecha'] = now();
        $data['estado'] = $data['estado'] ?? 'activa'; // 👈 Se asigna 'activa' por defecto

        $alerta = Alerta::create($data);

        return response()->json([
            'message' => 'Alerta/Incidencia registrada exitosamente',
            'data' => new AlertaResource($alerta)
        ], 201);
    }

    /**
     * Ver el detalle de una alerta específica.
     */
    public function show($id): JsonResponse
    {
        $alerta = Alerta::findOrFail($id);

        return response()->json([
            'data' => new AlertaResource($alerta)
        ]);
    }

    /**
     * Marcar una alerta como 'resuelta' o 'ignorada'.
     */
    public function resolver(Request $request, $id): JsonResponse
    {
        $request->validate([
            'estado' => 'required|in:activa,resuelta,ignorada'
        ]);

        $alerta = Alerta::findOrFail($id);
        $alerta->update([
            'estado' => $request->estado,
            'fecha_resolucion' => $request->estado === 'resuelta' ? now() : null
        ]);

        return response()->json([
            'message' => "Estado de la alerta actualizado a '{$request->estado}'",
            'data' => new AlertaResource($alerta)
        ]);
    }

    /**
     * Eliminar una alerta.
     */
    public function destroy($id): JsonResponse
    {
        $alerta = Alerta::findOrFail($id);
        $alerta->delete();

        return response()->json([
            'message' => 'Alerta eliminada exitosamente'
        ]);
    }
}