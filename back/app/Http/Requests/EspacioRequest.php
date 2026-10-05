<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EspacioRequest extends FormRequest
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
            'capacidad' => 'required|integer|min:1',
            'ubicacion' => 'required|string|max:255',
            'estado' => 'sometimes|in:disponible,mantenimiento,fuera_de_servicio',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del espacio es obligatorio.',
            'tipo.required' => 'El tipo de espacio es obligatorio.',
            'capacidad.required' => 'La capacidad debe ser un número entero mayor a 0.',
            'ubicacion.required' => 'La ubicación del espacio es obligatoria.',
            'estado.in' => 'El estado especificado no es válido.',
        ];
    }
}
