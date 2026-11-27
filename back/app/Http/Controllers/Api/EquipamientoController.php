<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EquipamientoRequest;
use App\Http\Resources\EquipamientoResource;
use App\Models\Equipamiento;
use App\Models\EquipoHistorial;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class EquipamientoController extends Controller
{
    public function index(Request ): AnonymousResourceCollection
    {
         = Equipamiento::query();

        if (->has('estado')) {
            ->where('estado', ->query('estado'));
        }

        if (->has('categoria')) {
            ->where('categoria', ->query('categoria'));
        }

        if (->has('tipo_movilidad')) {
            ->where('tipo_movilidad', ->query('tipo_movilidad'));
        }

        if (->has('espacio_id')) {
             = ->query('espacio_id');
            ->where(function () use () {
                ->where('espacio_habitual_id', )
                  ->orWhere('espacio_actual_id', );
            });
        }

        if (->has('search')) {
             = ->query('search');
            ->where('nombre', 'like', "%{}%");
        }

         = ->with(['espacioHabitual', 'espacioActual'])->get();

        return EquipamientoResource::collection();
    }

    public function store(EquipamientoRequest ): JsonResponse
    {
         = ->validated();

        if (!isset(['espacio_actual_id']) && isset(['espacio_habitual_id'])) {
            ['espacio_actual_id'] = ['espacio_habitual_id'];
        }

         = Equipamiento::create();

        return (new EquipamientoResource(->load(['espacioHabitual', 'espacioActual'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Equipamiento ): EquipamientoResource
    {
        ->load(['espacioHabitual', 'espacioActual', 'historial']);

        return new EquipamientoResource();
    }

    public function update(EquipamientoRequest , Equipamiento ): EquipamientoResource
    {
         = ->estado;
         = ->validated();

        ->update();
         = ->estado;

        if (->has('estado') &&  !== ) {
            // 1. Registro de Historial del equipo
            EquipoHistorial::create([
                'equipamiento_id' => ->id,
                'estado'          => ,
                'espacio_id'      => ->espacio_actual_id,
                'ubicacion_texto' => ->espacioActual?->nombre ?? 'Sin espacio asignado',
                'fecha_inicio'    => now(),
                'motivo'          => ->input('motivo', 'Cambio de estado desde API'),
            ]);

            // 2. Si pasa a DISPONIBLE -> Auto-resolver alertas activas asociadas a este equipamiento
            if ( === 'disponible') {
                Alerta::where(function () use () {
                    ->where('referencia_tipo', 'equipamiento')
                      ->where('referencia_id', ->id);
                })
                ->where('estado', 'activa')
                ->update([
                    'estado'           => 'resuelta',
                    'fecha_resolucion' => now(),
                    'updated_at'       => now(),
                ]);
            }

            // 3. Si pasa a MANTENIMIENTO o FUERA DE SERVICIO -> Crear alerta de incidencia con campos polimorficos
            if (in_array(, ['mantenimiento', 'fuera_de_servicio'])) {
                Alerta::create([
                    'tipo'            => 'incidencia',
                    'referencia_tipo' => 'equipamiento',
                    'referencia_id'   => ->id,
                    'mensaje'         => "El equipamiento '{->nombre}' cambió su estado a '{}'.",
                    'estado'          => 'activa',
                    'fecha'           => now(),
                ]);
            }
        }

        return new EquipamientoResource(->load(['espacioHabitual', 'espacioActual']));
    }

    public function destroy(Equipamiento ): JsonResponse
    {
        ->delete();

        return response()->json(['message' => 'Equipamiento eliminado correctamente'], 200);
    }
}
