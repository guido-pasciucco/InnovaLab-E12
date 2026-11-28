<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Usuario;
use App\Models\Espacio;
use App\Models\Actividad;
use App\Models\Reserva;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReservaTest extends TestCase
{
    use RefreshDatabase;

    public function test_detecta_conflicto_de_horario_y_devuelve_422(): void
    {
        $this->seed();
        $usuario = Usuario::where('email', 'admin@innovalab.edu.ar')->first();
        $espacio = Espacio::first();

        $actividad = Actividad::create([
            'nombre' => 'Práctica Médica',
            'tipo' => 'Taller',
            'responsable_id' => $usuario->id,
            'fecha' => now()->toDateString(),
            'hora_inicio' => '10:00',
            'hora_fin' => '12:00',
            'participantes_estimados' => 10,
            'estado' => 'programada',
        ]);

        // 1. Crear primera reserva exitosa
        Reserva::create([
            'actividad_id' => $actividad->id,
            'espacio_id' => $espacio->id,
            'fecha_hora_inicio' => now()->setTime(10, 0),
            'fecha_hora_fin' => now()->setTime(12, 0),
            'estado' => 'confirmada',
        ]);

        // 2. Intentar reservar en el mismo espacio y horario mediante API
        $response = $this->actingAs($usuario, 'sanctum')
            ->postJson('/api/v1/reservas', [
                'actividad_id' => $actividad->id,
                'espacio_id' => $espacio->id,
                'fecha_hora_inicio' => now()->setTime(11, 0)->format('Y-m-d H:i:s'),
                'fecha_hora_fin' => now()->setTime(13, 0)->format('Y-m-d H:i:s'),
                'estado' => 'confirmada',
            ]);

        // 3. Debe rechazar con HTTP 422
        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors', 'conflictos']);
    }
}