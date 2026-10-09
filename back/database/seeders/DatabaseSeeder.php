<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Espacio;
use App\Models\Equipamiento;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear Roles
        $adminRolId = DB::table('roles')->insertGetId([
            'nombre' => 'Administrador',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $gestionRolId = DB::table('roles')->insertGetId([
            'nombre' => 'Gestión / Coordinación',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Crear Usuario Admin Inicial
        Usuario::create([
            'nombre' => 'Administrador InnovaLab',
            'email' => 'admin@innovalab.edu.ar',
            'password' => Hash::make('admin123'),
            'rol_id' => $adminRolId,
            'activo' => true,
        ]);

        // 3. Crear Espacios de Ejemplo
        $lab1 = Espacio::create([
            'nombre' => 'Laboratorio de Simulación Médica 1',
            'tipo' => 'Laboratorio',
            'capacidad' => 25,
            'ubicacion' => 'Piso 2 - Ala Norte',
            'estado' => 'disponible',
        ]);

        $aula1 = Espacio::create([
            'nombre' => 'Aula Teórica A',
            'tipo' => 'Aula',
            'capacidad' => 40,
            'ubicacion' => 'Piso 1',
            'estado' => 'disponible',
        ]);

        // 4. Crear Equipamiento Inicial
        Equipamiento::create([
            'nombre' => 'Simulador de Paciente Adulto (Maniquí)',
            'categoria' => 'Simuladores',
            'tipo_movilidad' => 'fijo',
            'cantidad' => 2,
            'espacio_habitual_id' => $lab1->id,
            'estado' => 'disponible',
        ]);

        Equipamiento::create([
            'nombre' => 'Proyector Portátil HD',
            'categoria' => 'Audiovisual',
            'tipo_movilidad' => 'trasladable',
            'cantidad' => 5,
            'espacio_habitual_id' => null,
            'estado' => 'disponible',
        ]);
    }
}
