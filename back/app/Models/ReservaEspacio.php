<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservaEspacio extends Model
{
    protected $table = 'reserva_espacio';

    protected $fillable = [
        'actividad_id',
        'espacio_id',
        'hora_inicio',
        'hora_fin',
        'estado',
    ];

    public function actividad(): BelongsTo
    {
        return $this->belongsTo(Actividad::class, 'actividad_id');
    }

    public function espacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_id');
    }
}
