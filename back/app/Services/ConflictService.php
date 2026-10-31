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
                'tipo' => 'superposicion_horario',
                'espacio_id' => $espacioId,
                'reserva_id' => $reservaEspacioConflicto->id,
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
                        $msg = "El equipamiento '{$equipo->nombre}' está asignado a la actividad '{$reservaSolapada->actividad->nombre}' en ese horario.";
                        $errores[] = $msg;

                        $conflictosDetectados[] = [
                            'tipo' => 'equipamiento_no_disponible',
                            'espacio_id' => $espacioId,
                            'equipamiento_id' => $equipo->id,
                            'reserva_id' => $reservaSolapada->id,
                            'descripcion' => $msg
                        ];
                    }
                }
            }
        }

        // 3. Registrar incidencias en la tabla 'conflicto' con las columnas exactas de PostgreSQL
        if (!empty($conflictosDetectados)) {
            foreach ($conflictosDetectados as $conflicto) {
                Conflicto::create([
                    'tipo' => $conflicto['tipo'],
                    'espacio_id' => $conflicto['espacio_id'] ?? null,
                    'equipamiento_id' => $conflicto['equipamiento_id'] ?? null,
                    'fecha_detectado' => now(),
                    'resuelto' => false,
                    'descripcion' => $conflicto['descripcion'],
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
