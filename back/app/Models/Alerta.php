<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alerta extends Model
{
    protected $table = 'alerta';

    protected $fillable = [
        'tipo',
        'referencia_tipo',
        'referencia_id',
        'fecha',
        'estado',
        'mensaje',
    ];
}
