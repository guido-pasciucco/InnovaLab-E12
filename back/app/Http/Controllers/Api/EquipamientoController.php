<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EquipamientoRequest;
use App\Http\Resources\EquipamientoResource;
use App\Models\Equipamiento;
use App\Models\EquipoHistorial;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;

class EquipamientoController extends Controller
{
    public function index(Request ): JsonResponse
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
                ->where('espacio_habitual_id', );
                if (Schema::hasColumn('equipamiento', 'espacio_actual_id')) {
                    ->orWhere('espacio_actual_id', );
                }
            });
        }

        if (->has('search')) {
             = ->query('search');
            ->where('nombre', 'like', "%{}%");
        }

         = ['espacioHabitual'];
        if (Schema::hasColumn('equipamiento', 'espacio_actual_id')) {
            [] = 'espacioActual';
        }

         = ->with()->get();

        return response()->json(EquipamientoResource::collection());
    }

    public function store(EquipamientoRequest ): JsonResponse
    {
         = ->validated();

        if (!isset(['espacio_actual_id']) && isset(['espacio_habitual_id']) && Schema::hasColumn('equipamiento', 'espacio_actual_id')) {
            ['espacio_actual_id'] = ['espacio_habitual_id'];
        }

         = Equipamiento::create();

         = ['espacioHabitual'];
        if (Schema::hasColumn('equipamiento', 'espacio_actual_id')) {
            [] = 'espacioActual';
        }

        return (new EquipamientoResource(->load()))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Equipamiento ): JsonResponse
    {
         = ['espacioHabitual', 'historial'];
        if (Schema::hasColumn('equipamiento', 'espacio_actual_id')) {
            [] = 'espacioActual';
        }
        ->load();

        return response()->json(new EquipamientoResource());
    }

    public function update(EquipamientoRequest , Equipamiento ): JsonResponse
    {
         = ->estado;
         = ->validated();

        ->update();
         = ->estado;

        if (->has('estado') &&  !== ) {
            EquipoHistorial::create([
                'equipamiento_id' => ->id,
                'estado'          => ,
                'espacio_id'       => ->espacio_habitual_id,
                'ubicacion_texto'  => ->espacioHabitual?->nombre ?? 'Sin espacio asignado',
                'fecha_inicio'    => now(),
                'motivo'          => ->input('motivo', 'Cambio de estado desde API'),
            ]);

            if ( === 'disponible') {
                Alerta::where(function () use () {
                    ->where('equipamiento_id', ->id)
                      ->orWhere(function () use () {
                          ->where('referencia_tipo', 'equipamiento')
                             ->where('referencia_id', ->id);
                      });
                })->where('estado', 'activa')->update([
                    'estado'     => 'resuelta',
                    'updated_at' => now(),
                ]);
            }

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

         = ['espacioHabitual'];
        if (Schema::hasColumn('equipamiento', 'espacio_actual_id')) {
            [] = 'espacioActual';
        }

        return response()->json(new EquipamientoResource(->load()));
    }

    public function destroy(Equipamiento ): JsonResponse
    {
        ->delete();

        return response()->json(['message' => 'Equipamiento eliminado correctamente'], 200);
    }
}
