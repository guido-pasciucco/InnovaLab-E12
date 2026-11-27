<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EspacioResource extends JsonResource
{
    public function toArray(Request ): array
    {
        return [
            'id' => ->id,
            'nombre' => ->nombre,
            'tipo' => ->tipo,
            'capacidad' => ->capacidad,
            'ubicacion' => ->ubicacion,
            'estado' => ->estado,
            'equipamientos_habituales' => EquipamientoResource::collection(->whenLoaded('equipamientosHabituales')),
            'historial' => ->whenLoaded('historial'),
            'created_at' => ->created_at?->toIso8601String(),
            'updated_at' => ->updated_at?->toIso8601String(),
        ];
    }
}
