<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultaIa extends Model
{
    protected $table = 'consulta_ia';

    protected $fillable = [
        'usuario_id',
        'pregunta',
        'respuesta',
        'fecha',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
