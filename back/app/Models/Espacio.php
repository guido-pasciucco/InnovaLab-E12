<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Espacio extends Model
{
    protected  = 'espacios';

    protected  = [
        'nombre',
        'tipo',
        'capacidad',
        'ubicacion',
        'estado',
    ];

    public function equipamientosHabituales(): HasMany
    {
        return ->hasMany(Equipamiento::class, 'espacio_habitual_id');
    }

    public function equipamientos(): HasMany
    {
        return ->hasMany(Equipamiento::class, 'espacio_habitual_id');
    }

    public function reservas(): HasMany
    {
        return ->hasMany(ReservaEspacio::class, 'espacio_id');
    }

    public function historial(): HasMany
    {
        return ->hasMany(EspacioHistorial::class, 'espacio_id');
    }

    public function ultimoHistorial(): HasOne
    {
        return ->hasOne(EspacioHistorial::class, 'espacio_id')->latestOfMany();
    }
}
