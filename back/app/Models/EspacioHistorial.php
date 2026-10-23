<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EspacioHistorial extends Model
{
    protected $table = 'espacio_historial';

    protected $fillable = [
        'espacio_id',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'motivo',
    ];

    public function espacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_id');
    }
}
