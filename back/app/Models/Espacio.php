<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Espacio extends Model
{
    use HasFactory;

    protected $table = 'espacios';

    protected $fillable = [
        'nombre',
        'tipo',
        'capacidad',
        'ubicacion',
        'estado',
    ];

    /**
     * Equipamiento que pertenece habitualmente a este espacio.
     */
    public function equipamientosHabituales(): HasMany
    {
        return $this->hasMany(Equipamiento::class, 'espacio_habitual_id');
    }

    /**
     * Equipamiento que se encuentra actualmente en este espacio.
     */
    public function equipamientosActuales(): HasMany
    {
        return $this->hasMany(Equipamiento::class, 'espacio_actual_id');
    }

    /**
     * Historial de cambios de estado del espacio.
     */
    public function historial(): HasMany
    {
        return $this->hasMany(EspacioHistorial::class, 'espacio_id');
    }

    /**
     * Reservas asociadas al espacio.
     */
    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class, 'espacio_id');
    }
}
