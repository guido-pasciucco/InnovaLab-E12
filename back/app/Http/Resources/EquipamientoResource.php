<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipamientoResource extends JsonResource
{
    public function toArray(Request ): array
    {
        return [
            'id' => ->id,
            'nombre' => ->nombre,
            'categoria' => ->categoria,
            'tipo_movilidad' => ->tipo_movilidad,
            'cantidad' => ->cantidad,
            'estado' => ->estado,
            'espacio_habitual_id' => ->espacio_habitual_id,
            'espacio_habitual' => new EspacioResource(->whenLoaded('espacioHabitual')),
            'espacio_actual_id' => ->espacio_actual_id ?? ->espacio_habitual_id,
            'espacio_actual' => new EspacioResource(->whenLoaded('espacioActual')),
            'historial' => ->whenLoaded('historial'),
            'created_at' => ->created_at?->toIso8601String(),
            'updated_at' => ->updated_at?->toIso8601String(),
        ];
    }
}
