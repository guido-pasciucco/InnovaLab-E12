<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipamientoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'categoria' => $this->categoria,
            'tipo_movilidad' => $this->tipo_movilidad,
            'cantidad' => $this->cantidad,
            'estado' => $this->estado,
            'espacio_habitual_id' => $this->espacio_habitual_id,
            'espacio_habitual' => new EspacioResource($this->whenLoaded('espacioHabitual')),
            'historial' => $this->whenLoaded('historial'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
