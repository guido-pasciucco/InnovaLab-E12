<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipoHistorial extends Model
{
    protected $table = 'equipo_historial';

    protected $fillable = [
        'equipamiento_id',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'motivo',
    ];

    public function equipamiento(): BelongsTo
    {
        return $this->belongsTo(Equipamiento::class, 'equipamiento_id');
    }
}
