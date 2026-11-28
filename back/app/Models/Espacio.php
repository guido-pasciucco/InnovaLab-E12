<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Espacio extends Model
{
    protected $table = 'espacios';

    protected $fillable = [
        'nombre',
        'tipo',
        'capacidad',
        'ubicacion',
        'estado',
    ];

    public function equipamientosHabituales(): HasMany
    {
        return $this->hasMany(Equipamiento::class, 'espacio_habitual_id');
    }

    public function equipamientos(): HasMany
    {
        return $this->hasMany(Equipamiento::class, 'espacio_habitual_id');
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(ReservaEspacio::class, 'espacio_id');
    }

    public function historial(): HasMany
    {
        return $this->hasMany(EspacioHistorial::class, 'espacio_id');
    }

    public function ultimoHistorial(): HasOne
    {
        return $this->hasOne(EspacioHistorial::class, 'espacio_id')->latestOfMany();
    }
}
