<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EspacioRequest;
use App\Http\Resources\EspacioResource;
use App\Models\Espacio;
use App\Models\EspacioHistorial;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EspacioController extends Controller
{
    public function index(Request ): JsonResponse
    {
         = Espacio::query();

        if (->has('estado')) {
            ->where('estado', ->query('estado'));
        }

        if (->has('tipo')) {
            ->where('tipo', ->query('tipo'));
        }

        if (->has('search')) {
             = ->query('search');
            ->where(function () use () {
                ->where('nombre', 'like', "%{}%")
                  ->orWhere('ubicacion', 'like', "%{}%");
            });
        }

         = ->with(['equipamientosHabituales'])->get();

        return response()->json(EspacioResource::collection());
    }

    public function store(EspacioRequest ): JsonResponse
    {
         = Espacio::create(->validated());

        EspacioHistorial::create([
            'espacio_id'   => ->id,
            'estado'       => ->estado,
            'fecha_inicio' => now(),
            'motivo'       => 'Alta inicial del espacio',
        ]);

        return (new EspacioResource())
            ->response()
            ->setStatusCode(201);
    }

    public function show(Espacio ): JsonResponse
    {
        ->load(['equipamientosHabituales', 'historial']);
        return response()->json(new EspacioResource());
    }

    public function update(EspacioRequest , Espacio ): JsonResponse
    {
         = ->estado;
        ->update(->validated());
         = ->estado;

        if (->has('estado') &&  !== ) {
            EspacioHistorial::create([
                'espacio_id'   => ->id,
                'estado'       => ,
                'fecha_inicio' => now(),
                'motivo'       => ->input('motivo', 'Cambio de estado desde API'),
            ]);

            if ( === 'disponible') {
                Alerta::where(function () use () {
                    ->where('espacio_id', ->id)
                      ->orWhere(function () use () {
                          ->where('referencia_tipo', 'espacio')
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
                    'referencia_tipo' => 'espacio',
                    'referencia_id'   => ->id,
                    'mensaje'         => "El espacio '{->nombre}' cambió su estado a '{}'.",
                    'estado'          => 'activa',
                    'fecha'           => now(),
                ]);
            }
        }

        return response()->json(new EspacioResource());
    }

    public function destroy(Espacio ): JsonResponse
    {
        ->delete();

        return response()->json(['message' => 'Espacio eliminado correctamente'], 200);
    }
}
