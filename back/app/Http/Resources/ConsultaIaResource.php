<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultaIaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuario_id' => $this->usuario_id,
            'usuario_nombre' => $this->usuario?->nombre,
            'pregunta' => $this->pregunta,
            'respuesta' => $this->respuesta,
            'fecha' => $this->fecha?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}