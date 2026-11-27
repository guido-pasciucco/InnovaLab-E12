<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipamiento extends Model
{
    protected  = 'equipamiento';

    protected  = [
        'nombre',
        'categoria',
        'tipo_movilidad',
        'cantidad',
        'espacio_habitual_id',
        'espacio_actual_id',
        'estado',
    ];

    public function espacioHabitual(): BelongsTo
    {
        return ->belongsTo(Espacio::class, 'espacio_habitual_id');
    }

    public function espacioActual(): BelongsTo
    {
        return ->belongsTo(Espacio::class, 'espacio_actual_id')->withDefault(function () {
            return ->espacioHabitual;
        });
    }

    public function reservas(): HasMany
    {
        return ->hasMany(ReservaEquipamiento::class, 'equipamiento_id');
    }

    public function historial(): HasMany
    {
        return ->hasMany(EquipoHistorial::class, 'equipamiento_id');
    }
}
