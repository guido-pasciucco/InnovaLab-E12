<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'email' => $this->email,
            'activo' => (bool) $this->activo,
            'rol' => $this->whenLoaded('rol', function () {
                return [
                    'id' => $this->rol->id,
                    'nombre' => $this->rol->nombre,
                ];
            }),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
