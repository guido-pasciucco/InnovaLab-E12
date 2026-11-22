<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $casts = [
        'capacidad' => 'integer',
    ];

    /* ==========================================
     | Mutadores para normalizar a minúsculas
     + ========================================== */

    public function setNombreAttribute($value): void
    {
        $this->attributes['nombre'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    public function setTipoAttribute($value): void
    {
        $this->attributes['tipo'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    public function setUbicacionAttribute($value): void
    {
        $this->attributes['ubicacion'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    public function setEstadoAttribute($value): void
    {
        $this->attributes['estado'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    /* ==========================================
     | Relaciones Eloquent
     + ========================================== */

    public function equipamientosHabituales(): HasMany
    {
        return $this->hasMany(Equipamiento::class, 'espacio_habitual_id');
    }

    public function equipamientosActuales(): HasMany
    {
        return $this->hasMany(Equipamiento::class, 'espacio_actual_id');
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(ReservaEspacio::class, 'espacio_id');
    }

    public function historial(): HasMany
    {
        return $this->hasMany(EspacioHistorial::class, 'espacio_id');
    }
}
