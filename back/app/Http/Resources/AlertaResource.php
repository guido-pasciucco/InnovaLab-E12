<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlertaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tipo' => $this->tipo,
            'referencia_tipo' => $this->referencia_tipo,
            'referencia_id' => $this->referencia_id,
            'mensaje' => $this->mensaje,
            'estado' => $this->estado,
            'fecha' => $this->fecha?->toIso8601String() ?? $this->created_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
