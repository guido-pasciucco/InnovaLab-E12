<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipamiento extends Model
{
    use HasFactory;

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

    public function espacioHabitual(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_habitual_id');
    }

    public function espacioActual(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_actual_id');
    }

    public function reservas(): BelongsToMany
    {
        return $this->belongsToMany(Reserva::class, 'equipamiento_reserva', 'equipamiento_id', 'reserva_id');
    }

    public function historial(): HasMany
    {
        return $this->hasMany(EquipoHistorial::class, 'equipamiento_id');
    }
}
