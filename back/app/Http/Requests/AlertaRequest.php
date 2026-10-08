<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AlertaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => 'required|string|in:conflicto_reserva,mantenimiento,equipo_desplazado,incidencia,sistema',
            'referencia_tipo' => 'nullable|string|in:espacio,equipamiento,conflicto,reserva',
            'referencia_id' => 'nullable|integer',
            'mensaje' => 'required|string|max:500',
            'estado' => 'sometimes|in:activa,resuelta,ignorada'
        ];
    }
}
