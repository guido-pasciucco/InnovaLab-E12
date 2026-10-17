<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipamiento extends Model
{
    protected $table = 'equipamiento';

    protected $fillable = [
        'nombre',
        'categoria',
        'tipo_movilidad',
        'cantidad',
        'espacio_habitual_id',
        'espacio_actual_id',
        'estado',
    ];
}
