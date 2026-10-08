<?php

namespace App\Services;

use App\Models\Reserva;
use App\Models\Conflicto;
use App\Services\AlertaService;
use Carbon\Carbon;

class ConflictService
{
    protected AlertaService $alertaService;

    public function __construct(AlertaService $alertaService)
    {
        $this->alertaService = $alertaService;
    }

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
            $msg = "El espacio '{$reservaEspacioConflicto->espacio->nombre}' ya se encuentra reservado entre " . 
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

        // 2. Registrar incidencias en 'conflictos' y disparar 'alertas'
        if (!empty($conflictosDetectados)) {
            foreach ($conflictosDetectados as $conflicto) {
                $nuevoConflicto = Conflicto::create([
                    'espacio_id' => $espacioId,
                    'equipamiento_id' => $conflicto['equipamiento_id'] ?? null,
                    'reserva_id' => $conflicto['reserva_existente_id'],
                    'tipo_conflicto' => $conflicto['tipo'],
                    'descripcion' => $conflicto['descripcion'],
                    'resuelto' => false,
                    'fecha_deteccion' => now()
                ]);

                // 🔔 Genera la alerta automática en la tabla 'alertas'
                $this->alertaService->registrarAlertaConflicto(
                    $nuevoConflicto->id,
                    $conflicto['descripcion']
                );
            }
        }

        return [
            'tiene_conflicto' => !empty($errores),
            'errores' => $errores,
            'conflictos_detectados' => $conflictosDetectados
        ];
    }
}