<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservaEquipamiento extends Model
{
    protected $table = 'reserva_equipamiento';

    protected $fillable = [
        'actividad_id',
        'equipamiento_id',
        'cantidad',
        'hora_inicio',
        'hora_fin',
        'estado',
    ];

    public function actividad(): BelongsTo
    {
        return $this->belongsTo(Actividad::class, 'actividad_id');
    }

    public function equipamiento(): BelongsTo
    {
        return $this->belongsTo(Equipamiento::class, 'equipamiento_id');
    }
}
