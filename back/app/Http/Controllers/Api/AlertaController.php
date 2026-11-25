<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AlertaController extends Controller
{
    /**
     * GET /api/v1/alertas
     * Permite listar alertas, opcionalmente filtrando por estado (ej: ?estado=activa)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Alerta::query()->with(['espacio', 'equipamiento']);

        if ($request->has('estado')) {
            $query->where('estado', $request->query('estado'));
        }

        $alertas = $query->orderBy('created_at', 'desc')->get();

        return response()->json($alertas);
    }

    /**
     * POST /api/v1/alertas
     * Permite crear una nueva alerta manualmente
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tipo'            => 'required|string|max:100',
            'mensaje'         => 'required|string',
            'espacio_id'      => 'nullable|exists:espacios,id',
            'equipamiento_id' => 'nullable|exists:equipamiento,id',
            'estado'          => 'sometimes|in:activa,resuelta,ignorada',
        ]);

        $alerta = Alerta::create([
            'tipo'            => $validated['tipo'],
            'mensaje'         => $validated['mensaje'],
            'espacio_id'      => $validated['espacio_id'] ?? null,
            'equipamiento_id' => $validated['equipamiento_id'] ?? null,
            'estado'          => $validated['estado'] ?? 'activa',
        ]);

        return response()->json([
            'message' => 'Alerta creada correctamente',
            'alerta'  => $alerta->load(['espacio', 'equipamiento']),
        ], 201);
    }

    /**
     * PUT/PATCH /api/v1/alertas/{alerta}
     * Permite actualizar cualquier campo/estado de una alerta via REST estándar
     */
    public function update(Request $request, Alerta $alerta): JsonResponse
    {
        $validated = $request->validate([
            'estado' => 'required|string|in:activa,resuelta,ignorada',
        ]);

        $alerta->update([
            'estado'     => $validated['estado'],
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Estado de alerta actualizado correctamente',
            'alerta'  => $alerta->fresh(['espacio', 'equipamiento']),
        ]);
    }

    /**
     * PUT /api/v1/alertas/{id}/resolver
     * Marca una alerta como 'resuelta' (coincide con tu ruta específica)
     */
    public function resolver($id): JsonResponse
    {
        $alerta = Alerta::findOrFail($id);

        $alerta->update([
            'estado'     => 'resuelta',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Alerta marcada como resuelta correctamente',
            'alerta'  => $alerta->load(['espacio', 'equipamiento']),
        ]);
    }
}