<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function equipamientosHabituales()
    {
        return $this->hasMany(Equipamiento::class, 'espacio_habitual_id');
    }

    /**
     * Equipamiento que se encuentra actualmente en este espacio.
     */
    public function equipamientosActuales()
    {
        return $this->hasMany(Equipamiento::class, 'espacio_actual_id');
    }
}