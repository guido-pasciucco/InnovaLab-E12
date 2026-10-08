<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'actividad_id' => 'required|exists:actividades,id',
            'espacio_id' => 'required|exists:espacios,id',
            'fecha_hora_inicio' => 'required|date|after_or_equal:now',
            'fecha_hora_fin' => 'required|date|after:fecha_hora_inicio',
            'estado' => 'sometimes|in:pendiente,confirmada,rechazada,cancelada',
            'equipamiento_ids' => 'nullable|array',
            'equipamiento_ids.*' => 'exists:equipamiento,id',
            'observaciones' => 'nullable|string'
        ];
    }
}
