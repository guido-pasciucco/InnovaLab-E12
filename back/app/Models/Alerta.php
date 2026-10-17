<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alerta extends Model
{
    use HasFactory;

    protected $table = 'alerta';

    protected $fillable = [
        'tipo',
        'referencia_tipo',
        'referencia_id',
        'mensaje',
        'estado',
        'fecha'
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];
}
