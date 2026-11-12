<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'actividad_id' => $this->actividad_id,
            'espacio_id' => $this->espacio_id,
            'fecha_hora_inicio' => $this->fecha_hora_inicio,
            'fecha_hora_fin' => $this->fecha_hora_fin,
            'estado' => $this->estado,
            'observaciones' => $this->observaciones,
            'actividad' => new ActividadResource($this->whenLoaded('actividad')),
            'espacio' => new EspacioResource($this->whenLoaded('espacio')),
            'equipamientos' => EquipamientoResource::collection($this->whenLoaded('equipamientos')),
            'solicitante' => new UserResource($this->whenLoaded('solicitante')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
