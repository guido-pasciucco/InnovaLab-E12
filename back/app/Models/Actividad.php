<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Actividad extends Model
{
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

    public function reservasEspacio(): HasMany
    {
        return $this->hasMany(ReservaEspacio::class, 'actividad_id');
    }

    public function reservasEquipamiento(): HasMany
    {
        return $this->hasMany(ReservaEquipamiento::class, 'actividad_id');
    }
}
