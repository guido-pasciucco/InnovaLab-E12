<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultaIa extends Model
{
    use HasFactory;

    protected $table = 'consulta_ia';

    protected $fillable = [
        'usuario_id',
        'pregunta',
        'respuesta',
        'fecha'
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}