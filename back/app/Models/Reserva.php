<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reserva extends Model
{
    use HasFactory;

    protected $table = 'reservas';

    protected $fillable = [
        'actividad_id',
        'espacio_id',
        'usuario_solicitante_id',
        'fecha_hora_inicio',
        'fecha_hora_fin',
        'estado',
        'observaciones',
    ];

    public function espacio(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_id');
    }

    public function actividad(): BelongsTo
    {
        return $this->belongsTo(Actividad::class, 'actividad_id');
    }

    public function solicitante(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_solicitante_id');
    }

    public function equipamientos(): BelongsToMany
    {
        return $this->belongsToMany(Equipamiento::class, 'equipamiento_reserva', 'reserva_id', 'equipamiento_id');
    }

    public function conflictos(): HasMany
    {
        return $this->hasMany(Conflicto::class, 'reserva_id');
    }
}
