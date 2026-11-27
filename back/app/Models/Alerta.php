<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alerta extends Model
{
    protected  = 'alerta';

    protected  = [
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

    protected  = [
        'fecha' => 'datetime',
        'fecha_resolucion' => 'datetime',
    ];

    public function espacio(): BelongsTo
    {
        return ->belongsTo(Espacio::class, 'espacio_id')->withDefault(function () {
            if (->referencia_tipo === 'espacio' && ->referencia_id) {
                return Espacio::find(->referencia_id);
            }
        });
    }

    public function equipamiento(): BelongsTo
    {
        return ->belongsTo(Equipamiento::class, 'equipamiento_id')->withDefault(function () {
            if (->referencia_tipo === 'equipamiento' && ->referencia_id) {
                return Equipamiento::find(->referencia_id);
            }
        });
    }
}
