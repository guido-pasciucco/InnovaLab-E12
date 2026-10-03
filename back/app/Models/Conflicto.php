<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conflicto extends Model
{
    protected $table = 'conflicto';

    protected $fillable = [
        'tipo',
        'reserva_espacio_id',
        'reserva_equipamiento_id',
        'fecha_detectado',
        'resuelto',
        'descripcion',
    ];

    public function reservaEspacio(): BelongsTo
    {
        return $this->belongsTo(ReservaEspacio::class, 'reserva_espacio_id');
    }

    public function reservaEquipamiento(): BelongsTo
    {
        return $this->belongsTo(ReservaEquipamiento::class, 'reserva_equipamiento_id');
    }
}
