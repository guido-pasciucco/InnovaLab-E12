<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Actividad extends Model
{
    use HasFactory;

    protected $table = 'actividades';

    protected $fillable = [
        'nombre',
        'tipo',
        'responsable_id',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'participantes_estimados',
        'estado',
    ];

    public function responsable(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'responsable_id');
    }

    public function docente(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'responsable_id');
    }
}
