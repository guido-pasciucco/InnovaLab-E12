<?php

namespace App\Services;

use App\Models\Alerta;

class AlertaService
{
    /**
     * Genera una nueva alerta en el sistema.
     */
    public function crearAlerta(
        string $tipo,
        string $mensaje,
        ?string $referenciaTipo = null,
        ?int $referenciaId = null
    ): Alerta {
        return Alerta::create([
            'tipo' => $tipo,
            'referencia_tipo' => $referenciaTipo,
            'referencia_id' => $referenciaId,
            'mensaje' => $mensaje,
            'estado' => 'activa', // 👈 Cambiado a 'activa'
            'fecha' => now(),
        ]);
    }

    /**
     * Genera alerta automática por conflicto de reserva.
     */
    public function registrarAlertaConflicto(int $conflictoId, string $descripcion): Alerta
    {
        return $this->crearAlerta(
            'conflicto_reserva',
            $descripcion,
            'conflicto',
            $conflictoId
        );
    }

    /**
     * Genera alerta cuando un equipamiento o espacio pasa a mantenimiento/fuera de servicio.
     */
    public function registrarAlertaMantenimiento(string $entidad, int $entidadId, string $nombre, string $nuevoEstado): Alerta
    {
        $mensaje = "El/La {$entidad} '{$nombre}' cambió su estado a '{$nuevoEstado}'. Verificar impacto en reservas.";
        return $this->crearAlerta(
            'mantenimiento',
            $mensaje,
            strtolower($entidad),
            $entidadId
        );
    }
}