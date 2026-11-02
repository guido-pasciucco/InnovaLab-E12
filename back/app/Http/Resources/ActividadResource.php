<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActividadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'tipo' => $this->tipo,
            'descripcion' => $this->descripcion,
            'cantidad_alumnos' => $this->cantidad_alumnos,
            'estado' => $this->estado,
            'docente' => new UserResource($this->whenLoaded('docente')),
            'reservas' => ReservaResource::collection($this->whenLoaded('reservas')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
