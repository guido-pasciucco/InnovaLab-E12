<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EspacioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'tipo' => $this->tipo,
            'capacidad' => $this->capacidad,
            'ubicacion' => $this->ubicacion,
            'estado' => $this->estado,
            'equipamientos_habituales' => EquipamientoResource::collection($this->whenLoaded('equipamientosHabituales')),
            'historial' => $this->whenLoaded('historial'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
