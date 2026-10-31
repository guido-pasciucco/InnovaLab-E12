<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActividadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|max:100',
            'responsable_id' => 'sometimes|exists:usuarios,id',
            'docente_id' => 'sometimes|exists:usuarios,id',
            'fecha' => 'required|date',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'participantes_estimados' => 'sometimes|integer|min:1',
            'cantidad_alumnos' => 'sometimes|integer|min:1',
            'descripcion' => 'nullable|string',
            'estado' => 'sometimes|in:planificada,programada,en_curso,finalizada,cancelada',
        ];
    }
}
