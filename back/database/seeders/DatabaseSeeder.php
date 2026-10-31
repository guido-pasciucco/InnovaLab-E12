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

        // 1. ROLES
        $adminRol = Rol::firstOrCreate(['id' => 1], ['nombre' => 'Administrador']);
        $coordRol = Rol::firstOrCreate(['id' => 2], ['nombre' => 'Gestión/Coordinación']);

        // 2. USUARIOS (Admin y Coordinadores)
        Usuario::firstOrCreate(
            ['email' => 'admin@innovalab.edu.ar'],
            [
                'nombre' => 'Admin InnovaLab',
                'password' => Hash::make('admin123'),
                'rol_id' => $adminRol->id,
                'activo' => true,
            ]
        );

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

        // 3. LABORATORIOS Y ESPACIOS REALES (Sede 25 de Mayo 444, CABA)
        $labAutoelevadores = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Autoelevadores y Logística'],
            ['tipo' => 'laboratorio', 'capacidad' => 15, 'ubicacion' => 'Piso 1 - Sede CABA (25 de Mayo 444)', 'estado' => 'disponible']
        );

        $labMaquinaria = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Maquinaria Pesada y Construcción'],
            ['tipo' => 'laboratorio', 'capacidad' => 20, 'ubicacion' => 'Piso 1 - Sede CABA (25 de Mayo 444)', 'estado' => 'disponible']
        );

        $labTransporte = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Transporte y Seguridad Vial'],
            ['tipo' => 'laboratorio', 'capacidad' => 25, 'ubicacion' => 'Piso 1 - Sede CABA (25 de Mayo 444)', 'estado' => 'disponible']
        );

        $labSeguridad = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Seguridad e Higiene Industrial'],
            ['tipo' => 'laboratorio', 'capacidad' => 20, 'ubicacion' => 'Piso 2 - Sede CABA (25 de Mayo 444)', 'estado' => 'disponible']
        );

        $salaA = Espacio::firstOrCreate(
            ['nombre' => 'Laboratorio de Simulación A'],
            ['tipo' => 'laboratorio', 'capacidad' => 20, 'ubicacion' => 'Piso 1 - Ala Norte', 'estado' => 'disponible']
        );

        $capacitacion = Espacio::firstOrCreate(
            ['nombre' => 'Sala de Capacitación Virtual'],
            ['tipo' => 'aula', 'capacidad' => 40, 'ubicacion' => 'Piso 2 - Ala Sur', 'estado' => 'mantenimiento']
        );

        // 4. CATÁLOGO REAL DE SIMULADORES Y EQUIPAMIENTO
        Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador de Autoelevador Portátil'],
            ['categoria' => 'Logística e Industria', 'tipo_movilidad' => 'trasladable', 'cantidad' => 3, 'espacio_habitual_id' => $labAutoelevadores->id, 'espacio_actual_id' => $labAutoelevadores->id, 'estado' => 'disponible']
        );

        Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador de Autoelevador Motorizado'],
            ['categoria' => 'Logística e Industria', 'tipo_movilidad' => 'fijo', 'cantidad' => 1, 'espacio_habitual_id' => $labAutoelevadores->id, 'espacio_actual_id' => $labAutoelevadores->id, 'estado' => 'disponible']
        );

        Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador de Retroexcavadora Motorizada'],
            ['categoria' => 'Maquinaria Pesada', 'tipo_movilidad' => 'fijo', 'cantidad' => 1, 'espacio_habitual_id' => $labMaquinaria->id, 'espacio_actual_id' => $labMaquinaria->id, 'estado' => 'disponible']
        );

        Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador de Grúa Torre de Construcción'],
            ['categoria' => 'Maquinaria Pesada', 'tipo_movilidad' => 'fijo', 'cantidad' => 1, 'espacio_habitual_id' => $labMaquinaria->id, 'espacio_actual_id' => $labMaquinaria->id, 'estado' => 'disponible']
        );

        Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador Motorizado de Ómnibus de 2 Pisos'],
            ['categoria' => 'Transporte y Seguridad Vial', 'tipo_movilidad' => 'fijo', 'cantidad' => 1, 'espacio_habitual_id' => $labTransporte->id, 'espacio_actual_id' => $labTransporte->id, 'estado' => 'disponible']
        );

        Equipamiento::firstOrCreate(
            ['nombre' => 'Simulador de Seguridad e Higiene Portátil'],
            ['categoria' => 'Seguridad e Higiene', 'tipo_movilidad' => 'trasladable', 'cantidad' => 2, 'espacio_habitual_id' => $labSeguridad->id, 'espacio_actual_id' => $labSeguridad->id, 'estado' => 'disponible']
        );

        $monitor = Equipamiento::firstOrCreate(
            ['nombre' => 'Monitor de Signos Vitales'],
            ['categoria' => 'Médico', 'tipo_movilidad' => 'fijo', 'cantidad' => 2, 'espacio_habitual_id' => $salaA->id, 'espacio_actual_id' => $salaA->id, 'estado' => 'fuera_de_servicio']
        );

        // 5. ACTIVIDADES ACADÉMICAS Y PRÁCTICAS
        Actividad::firstOrCreate(
            ['nombre' => 'Capacitación Operativa de Autoelevadores'],
            ['tipo' => 'practica', 'responsable_id' => $ana->id, 'fecha' => $hoy->toDateString(), 'hora_inicio' => '09:00:00', 'hora_fin' => '12:00:00', 'participantes_estimados' => 12, 'estado' => 'programada']
        );

        Actividad::firstOrCreate(
            ['nombre' => 'Simulación de Manejo de Maquinaria Pesada'],
            ['tipo' => 'workshop', 'responsable_id' => $carlos->id, 'fecha' => $hoy->toDateString(), 'hora_inicio' => '14:00:00', 'hora_fin' => '17:00:00', 'participantes_estimados' => 15, 'estado' => 'programada']
        );

        // 6. ALERTAS ACTIVAS PARA DASHBOARD
        Alerta::firstOrCreate(
            ['mensaje' => 'Monitor de Signos Vitales fuera de servicio'],
            ['tipo' => 'equipamiento_fuera_de_servicio', 'referencia_tipo' => 'equipamiento', 'referencia_id' => $monitor->id, 'fecha' => $now, 'estado' => 'activa']
        );

        Alerta::firstOrCreate(
            ['mensaje' => 'Sala de Capacitación Virtual en mantenimiento'],
            ['tipo' => 'espacio_no_disponible', 'referencia_tipo' => 'espacio', 'referencia_id' => $capacitacion->id, 'fecha' => $now, 'estado' => 'activa']
        );

        // 7. CONFLICTO DE PRUEBA
        Conflicto::firstOrCreate(
            ['descripcion' => 'Solapamiento en Laboratorio de Autoelevadores detectado'],
            ['tipo' => 'superposicion_horario', 'espacio_id' => $labAutoelevadores->id, 'fecha_detectado' => $now, 'resuelto' => false]
        );
    }
}