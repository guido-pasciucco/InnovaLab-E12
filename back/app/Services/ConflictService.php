<?php

namespace App\Services;

use App\Models\Reserva;
use App\Models\Conflicto;
use Carbon\Carbon;

class ConflictService
{
    /**
     * Verifica si existen conflictos de horario para un espacio o equipamiento.
     */
    public function verificarDisponibilidad(
        int $espacioId,
        string $fechaInicio,
        string $fechaFin,
        array $equipamientoIds = [],
        ?int $reservaIgnoradaId = null
    ): array {
        $errores = [];
        $conflictosDetectados = [];

        // 1. Solapamiento de Espacio
        $reservaEspacioConflicto = Reserva::where('espacio_id', $espacioId)
            ->whereIn('estado', ['confirmada', 'pendiente'])
            ->when($reservaIgnoradaId, fn($q) => $q->where('id', '!=', $reservaIgnoradaId))
            ->where(function ($query) use ($fechaInicio, $fechaFin) {
                $query->where('fecha_hora_inicio', '<', $fechaFin)
                      ->where('fecha_hora_fin', '>', $fechaInicio);
            })
            ->with(['espacio', 'actividad'])
            ->first();

        if ($reservaEspacioConflicto) {
            $msg = "El espacio '{$reservaEspacioConflicto->espacio->nombre}' ya se encuentra reservado para la actividad '{$reservaEspacioConflicto->actividad->nombre}' entre " . 
                   Carbon::parse($reservaEspacioConflicto->fecha_hora_inicio)->format('d/m/Y H:i') . " y " . 
                   Carbon::parse($reservaEspacioConflicto->fecha_hora_fin)->format('H:i') . ".";
            
            $errores[] = $msg;

            $conflictosDetectados[] = [
                'tipo' => 'espacio',
                'espacio_id' => $espacioId,
                'reserva_existente_id' => $reservaEspacioConflicto->id,
                'descripcion' => $msg
            ];
        }

        // 2. Solapamiento de Equipamiento
        if (!empty($equipamientoIds)) {
            $reservasSolapadas = Reserva::whereIn('estado', ['confirmada', 'pendiente'])
                ->when($reservaIgnoradaId, fn($q) => $q->where('id', '!=', $reservaIgnoradaId))
                ->where(function ($query) use ($fechaInicio, $fechaFin) {
                    $query->where('fecha_hora_inicio', '<', $fechaFin)
                          ->where('fecha_hora_fin', '>', $fechaInicio);
                })
                ->whereHas('equipamientos', function ($q) use ($equipamientoIds) {
                    $q->whereIn('equipamiento_id', $equipamientoIds);
                })
                ->with(['equipamientos', 'actividad'])
                ->get();

            foreach ($reservasSolapadas as $reservaSolapada) {
                foreach ($reservaSolapada->equipamientos as $equipo) {
                    if (in_array($equipo->id, $equipamientoIds)) {
                        $msg = "El equipamiento '{$equipo->nombre}' está asignado a la reserva #{$reservaSolapada->id} ({$reservaSolapada->actividad->nombre}) en ese horario.";
                        $errores[] = $msg;

                        $conflictosDetectados[] = [
                            'tipo' => 'equipamiento',
                            'equipamiento_id' => $equipo->id,
                            'reserva_existente_id' => $reservaSolapada->id,
                            'descripcion' => $msg
                        ];
                    }
                }
            }
        }

        // 3. Registrar incidencias en la tabla 'conflictos'
        if (!empty($conflictosDetectados)) {
            foreach ($conflictosDetectados as $conflicto) {
                Conflicto::create([
                    'espacio_id' => $espacioId,
                    'equipamiento_id' => $conflicto['equipamiento_id'] ?? null,
                    'reserva_id' => $conflicto['reserva_existente_id'],
                    'tipo_conflicto' => $conflicto['tipo'],
                    'descripcion' => $conflicto['descripcion'],
                    'resuelto' => false,
                    'fecha_deteccion' => now()
                ]);
            }
        }

        return [
            'tiene_conflicto' => !empty($errores),
            'errores' => $errores,
            'conflictos_detectados' => $conflictosDetectados
        ];
    }
}
