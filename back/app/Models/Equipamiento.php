<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    protected $casts = [
        'cantidad'            => 'integer',
        'espacio_habitual_id' => 'integer',
        'espacio_actual_id'   => 'integer',
    ];

    /* ==========================================
     | Mutadores para normalizar a minúsculas
     + ========================================== */

    public function setNombreAttribute($value): void
    {
        $this->attributes['nombre'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    public function setCategoriaAttribute($value): void
    {
        $this->attributes['categoria'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    public function setTipoMovilidadAttribute($value): void
    {
        $this->attributes['tipo_movilidad'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    public function setEstadoAttribute($value): void
    {
        $this->attributes['estado'] = is_null($value) ? null : mb_strtolower($value, 'UTF-8');
    }

    /* ==========================================
     | Relaciones Eloquent
     + ========================================== */

    public function espacioHabitual(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_habitual_id');
    }

    public function espacioActual(): BelongsTo
    {
        return $this->belongsTo(Espacio::class, 'espacio_actual_id');
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(ReservaEquipamiento::class, 'equipamiento_id');
    }

    public function historial(): HasMany
    {
        return $this->hasMany(EquipoHistorial::class, 'equipamiento_id');
    }
}