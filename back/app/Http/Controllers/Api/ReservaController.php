<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Http\Requests\ReservaRequest;
use App\Http\Resources\ReservaResource;
use App\Services\ConflictService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReservaController extends Controller
{
    protected ConflictService $conflictService;

    public function __construct(ConflictService $conflictService)
    {
        $this->conflictService = $conflictService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Reserva::query();

        if ($request->has('espacio_id')) {
            $query->where('espacio_id', $request->query('espacio_id'));
        }

        if ($request->has('actividad_id')) {
            $query->where('actividad_id', $request->query('actividad_id'));
        }

        if ($request->has('estado')) {
            $query->where('estado', $request->query('estado'));
        }

        if ($request->has('fecha')) {
            $query->whereDate('fecha_hora_inicio', $request->query('fecha'));
        }

        $reservas = $query->with(['espacio', 'actividad.docente', 'equipamientos', 'solicitante'])->get();

        return response()->json([
            'data' => ReservaResource::collection($reservas)
        ]);
    }

    public function store(ReservaRequest $request): JsonResponse
    {
        $data = $request->validated();
        $equipamientoIds = $data['equipamiento_ids'] ?? [];

        // Validar disponibilidad sin solapamiento
        $validacion = $this->conflictService->verificarDisponibilidad(
            $data['espacio_id'],
            $data['fecha_hora_inicio'],
            $data['fecha_hora_fin'],
            $equipamientoIds
        );

        if ($validacion['tiene_conflicto']) {
            return response()->json([
                'message' => 'No se puede procesar la reserva debido a conflictos de horarios.',
                'errors' => $validacion['errores'],
                'conflictos' => $validacion['conflictos_detectados']
            ], 422);
        }

        $data['usuario_solicitante_id'] = $request->user()->id;
        $data['estado'] = $data['estado'] ?? 'confirmada';

        $reserva = Reserva::create($data);

        if (!empty($equipamientoIds)) {
            $reserva->equipamientos()->sync($equipamientoIds);
        }

        return response()->json([
            'message' => 'Reserva creada exitosamente',
            'data' => new ReservaResource($reserva->load(['espacio', 'actividad', 'equipamientos']))
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $reserva = Reserva::with(['espacio', 'actividad.docente', 'equipamientos', 'solicitante', 'conflictos'])->findOrFail($id);

        return response()->json([
            'data' => new ReservaResource($reserva)
        ]);
    }

    public function update(ReservaRequest $request, $id): JsonResponse
    {
        $reserva = Reserva::findOrFail($id);
        $data = $request->validated();
        $equipamientoIds = $data['equipamiento_ids'] ?? [];

        // Validar disponibilidad ignorando la reserva actual
        $validacion = $this->conflictService->verificarDisponibilidad(
            $data['espacio_id'] ?? $reserva->espacio_id,
            $data['fecha_hora_inicio'] ?? $reserva->fecha_hora_inicio,
            $data['fecha_hora_fin'] ?? $reserva->fecha_hora_fin,
            $equipamientoIds,
            $reserva->id
        );

        if ($validacion['tiene_conflicto']) {
            return response()->json([
                'message' => 'Conflicto de disponibilidad al actualizar la reserva.',
                'errors' => $validacion['errores'],
                'conflictos' => $validacion['conflictos_detectados']
            ], 422);
        }

        $reserva->update($data);

        if (isset($data['equipamiento_ids'])) {
            $reserva->equipamientos()->sync($equipamientoIds);
        }

        return response()->json([
            'message' => 'Reserva actualizada exitosamente',
            'data' => new ReservaResource($reserva->load(['espacio', 'actividad', 'equipamientos']))
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->update(['estado' => 'cancelada']);

        return response()->json([
            'message' => 'Reserva cancelada exitosamente'
        ]);
    }
}
