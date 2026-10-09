<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipamientoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'categoria' => 'required|string|max:100',
            'tipo_movilidad' => 'required|in:fijo,trasladable',
            'cantidad' => 'required|integer|min:1',
            'espacio_habitual_id' => 'nullable|exists:espacios,id',
            'espacio_actual_id' => 'nullable|exists:espacios,id',
            'estado' => 'sometimes|in:disponible,mantenimiento,fuera_de_servicio',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del equipamiento es obligatorio.',
            'categoria.required' => 'La categoría es obligatoria.',
            'tipo_movilidad.in' => 'El tipo de movilidad debe ser fijo o trasladable.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'espacio_habitual_id.exists' => 'El espacio habitual seleccionado no existe.',
            'espacio_actual_id.exists' => 'El espacio actual seleccionado no existe.',
        ];
    }
}
