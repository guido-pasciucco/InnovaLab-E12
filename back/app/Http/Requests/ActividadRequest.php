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
            'descripcion' => 'nullable|string',
            'cantidad_alumnos' => 'required|integer|min:1',
            'docente_id' => 'sometimes|exists:usuarios,id',
            'estado' => 'sometimes|in:planificada,en_curso,finalizada,cancelada'
        ];
    }
}
