<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Rol;
use App\Models\Usuario;
use App\Models\Espacio;
use App\Models\Equipamiento;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $adminRol = Rol::firstOrCreate(['id' => 1], ['nombre' => 'Administrador']);
        $coordRol = Rol::firstOrCreate(['id' => 2], ['nombre' => 'Gestión/Coordinación']);

        // 2. Usuario Administrador
        Usuario::firstOrCreate(
            ['email' => 'admin@innovalab.edu.ar'],
            [
                'nombre' => 'Admin InnovaLab',
                'password' => Hash::make('admin123'),
                'rol_id' => $adminRol->id,
                'activo' => true,
            ]
        );

        // 3. Espacios (estado permitido: disponible)
        $sala1 = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Simulación A'],
            [
                'tipo' => 'laboratorio', 
                'capacidad' => 20, 
                'ubicacion' => 'Piso 1 - Ala Norte', 
                'estado' => 'disponible'
            ]
        );

        // 4. Equipamiento
        Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador de Alta Fidelidad HAL S3201'],
            [
                'categoria' => 'Simulador Médico',
                'tipo_movilidad' => 'fijo',
                'cantidad' => 1,
                'espacio_habitual_id' => $sala1->id,
                'espacio_actual_id' => $sala1->id,
                'estado' => 'disponible',
            ]
        );
    }
}
