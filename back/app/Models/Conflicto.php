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
        'espacio_id',
        'equipamiento_id',
        'fecha_detectado',
        'resuelto',
        'fecha_resolucion',
        'descripcion',
    ];

    public function espacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_id');
    }

    public function equipamiento(): BelongsTo
    {
        return $this->belongsTo(Equipamiento::class, 'equipamiento_id');
    }
}
