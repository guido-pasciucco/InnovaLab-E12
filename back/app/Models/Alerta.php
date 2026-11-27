<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alerta extends Model
{
    protected $table = 'alerta';

    protected $fillable = [
        'tipo',
        'referencia_tipo',
        'referencia_id',
        'espacio_id',
        'equipamiento_id',
        'fecha',
        'estado',
        'fecha_resolucion',
        'mensaje',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'fecha_resolucion' => 'datetime',
    ];

    public function espacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_id')->withDefault(function () {
            if ($this->referencia_tipo === 'espacio' && $this->referencia_id) {
                return Espacio::find($this->referencia_id);
            }
        });
    }

    public function equipamiento(): BelongsTo
    {
        return $this->belongsTo(Equipamiento::class, 'equipamiento_id')->withDefault(function () {
            if ($this->referencia_tipo === 'equipamiento' && $this->referencia_id) {
                return Equipamiento::find($this->referencia_id);
            }
        });
    }
}
