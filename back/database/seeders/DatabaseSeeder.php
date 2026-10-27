<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\Rol;
use App\Models\Usuario;
use App\Models\Espacio;
use App\Models\Equipamiento;
use App\Models\Actividad;
use App\Models\Alerta;
use App\Models\Conflicto;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $hoy = Carbon::today();

        // 1. Roles
        $adminRol = Rol::firstOrCreate(['id' => 1], ['nombre' => 'Administrador']);
        $coordRol = Rol::firstOrCreate(['id' => 2], ['nombre' => 'Gestión/Coordinación']);

        // 2. Usuarios
        // Admin
        Usuario::firstOrCreate(
            ['email' => 'admin@innovalab.edu.ar'],
            [
                'nombre' => 'Admin InnovaLab',
                'password' => Hash::make('admin123'),
                'rol_id' => $adminRol->id,
                'activo' => true,
            ]
        );

        // Coordinadores (credenciales para Franco / Frontend)
        $ana = Usuario::firstOrCreate(
            ['email' => 'ana@innovalab.edu.ar'],
            [
                'nombre' => 'Coordinadora Ana',
                'password' => Hash::make('admin123'),
                'rol_id' => $coordRol->id,
                'activo' => true,
            ]
        );

        $carlos = Usuario::firstOrCreate(
            ['email' => 'carlos@innovalab.edu.ar'],
            [
                'nombre' => 'Coordinador Carlos',
                'password' => Hash::make('admin123'),
                'rol_id' => $coordRol->id,
                'activo' => true,
            ]
        );

        // 3. Espacios
        $salaA = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Simulación A'],
            ['tipo' => 'laboratorio', 'capacidad' => 20, 'ubicacion' => 'Piso 1 - Ala Norte', 'estado' => 'disponible']
        );

        $salaB = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Simulación B'],
            ['tipo' => 'laboratorio', 'capacidad' => 15, 'ubicacion' => 'Piso 1 - Ala Norte', 'estado' => 'disponible']
        );

        $aula101 = Espacio::firstOrCreate(
            ['nombre' => 'Aula 101'],
            ['tipo' => 'aula', 'capacidad' => 30, 'ubicacion' => 'Piso 1 - Ala Sur', 'estado' => 'disponible']
        );

        $taller = Espacio::firstOrCreate(
            ['nombre' => 'Taller de Práctica'],
            ['tipo' => 'taller', 'capacidad' => 25, 'ubicacion' => 'Piso 2 - Ala Norte', 'estado' => 'disponible']
        );

        $capacitacion = Espacio::firstOrCreate(
            ['nombre' => 'Sala de Capacitación'],
            ['tipo' => 'aula', 'capacidad' => 40, 'ubicacion' => 'Piso 2 - Ala Sur', 'estado' => 'mantenimiento']
        );

        // 4. Equipamiento
        $simHAL = Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador de Alta Fidelidad HAL S3201'],
            [
                'categoria' => 'Simulador Médico',
                'tipo_movilidad' => 'fijo',
                'cantidad' => 2,
                'espacio_habitual_id' => $salaA->id,
                'espacio_actual_id' => $salaA->id,
                'estado' => 'disponible',
            ]
        );

        $simAdulto = Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador Adulto A'],
            [
                'categoria' => 'Simulador Médico',
                'tipo_movilidad' => 'fijo',
                'cantidad' => 3,
                'espacio_habitual_id' => $salaB->id,
                'espacio_actual_id' => $salaB->id,
                'estado' => 'disponible',
            ]
        );

        $notebooks = Equipamiento::firstOrCreate(
            ['nombre' => 'Notebook Dell Latitude'],
            [
                'categoria' => 'Informática',
                'tipo_movilidad' => 'trasladable',
                'cantidad' => 15,
                'espacio_habitual_id' => $salaA->id,
                'espacio_actual_id' => $salaA->id,
                'estado' => 'disponible',
            ]
        );

        $proyector = Equipamiento::firstOrCreate(
            ['nombre' => 'Proyector Epson Portátil'],
            [
                'categoria' => 'Audiovisual',
                'tipo_movilidad' => 'trasladable',
                'cantidad' => 4,
                'espacio_habitual_id' => $aula101->id,
                'espacio_actual_id' => $aula101->id,
                'estado' => 'disponible',
            ]
        );

        $monitor = Equipamiento::firstOrCreate(
            ['nombre' => 'Monitor de Signos Vitales'],
            [
                'categoria' => 'Médico',
                'tipo_movilidad' => 'fijo',
                'cantidad' => 2,
                'espacio_habitual_id' => $salaA->id,
                'espacio_actual_id' => $salaA->id,
                'estado' => 'fuera_de_servicio',
            ]
        );

        // 5. Actividades (poblado para la agenda del día y gráficos de actividades)
        Actividad::firstOrCreate(
            ['nombre' => 'Taller de RCP Avanzado'],
            [
                'tipo' => 'Taller',
                'responsable_id' => $ana->id,
                'fecha' => $hoy->toDateString(),
                'hora_inicio' => '09:00:00',
                'hora_fin' => '12:00:00',
                'participantes_estimados' => 15,
                'estado' => 'programada',
            ]
        );

        Actividad::firstOrCreate(
            ['nombre' => 'Curso de Simulación Obstétrica'],
            [
                'tipo' => 'Curso',
                'responsable_id' => $carlos->id,
                'fecha' => $hoy->toDateString(),
                'hora_inicio' => '14:00:00',
                'hora_fin' => '17:00:00',
                'participantes_estimados' => 20,
                'estado' => 'programada',
            ]
        );

        Actividad::firstOrCreate(
            ['nombre' => 'Capacitación en Manejo de Vía Aérea'],
            [
                'tipo' => 'Capacitación',
                'responsable_id' => $ana->id,
                'fecha' => $hoy->copy()->addDays(1)->toDateString(),
                'hora_inicio' => '10:00:00',
                'hora_fin' => '13:00:00',
                'participantes_estimados' => 12,
                'estado' => 'programada',
            ]
        );

        // 6. Alertas activas para el Dashboard
        Alerta::firstOrCreate(
            ['mensaje' => 'Monitor de Signos Vitales fuera de servicio'],
            [
                'tipo' => 'equipamiento_fuera_de_servicio',
                'referencia_tipo' => 'equipamiento',
                'referencia_id' => $monitor->id,
                'fecha' => $now,
                'estado' => 'activa',
            ]
        );

        Alerta::firstOrCreate(
            ['mensaje' => 'Sala de Capacitación en mantenimiento'],
            [
                'tipo' => 'espacio_no_disponible',
                'referencia_tipo' => 'espacio',
                'referencia_id' => $capacitacion->id,
                'fecha' => $now,
                'estado' => 'activa',
            ]
        );

        // 7. Registro de Conflicto de prueba
        Conflicto::firstOrCreate(
            ['descripcion' => 'Solapamiento en Lab A detectado para actividad de RCP'],
            [
                'tipo' => 'superposicion_horario',
                'espacio_id' => $salaA->id,
                'fecha_detectado' => $now,
                'resuelto' => false,
            ]
        );
    }
}