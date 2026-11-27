<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EspacioRequest;
use App\Http\Resources\EspacioResource;
use App\Models\Espacio;
use App\Models\EspacioHistorial;
use App\Models\Alerta;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class EspacioController extends Controller
{
    public function index(Request ): AnonymousResourceCollection
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

        return EspacioResource::collection();
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

    public function show(Espacio ): EspacioResource
    {
        return new EspacioResource(->load(['equipamientosHabituales', 'historial']));
    }

    public function update(EspacioRequest , Espacio ): EspacioResource
    {
         = ->estado;
        ->update(->validated());
         = ->estado;

        if (->has('estado') &&  !== ) {
            // 1. Historial del espacio
            EspacioHistorial::create([
                'espacio_id'   => ->id,
                'estado'       => ,
                'fecha_inicio' => now(),
                'motivo'       => ->input('motivo', 'Cambio de estado desde API'),
            ]);

            // 2. Si pasa a DISPONIBLE -> Cerrar automáticamente alertas activas del espacio
            if ( === 'disponible') {
                Alerta::where(function () use () {
                    ->where('referencia_tipo', 'espacio')
                      ->where('referencia_id', ->id);
                })
                ->where('estado', 'activa')
                ->update([
                    'estado'           => 'resuelta',
                    'fecha_resolucion' => now(),
                    'updated_at'       => now(),
                ]);
            }

            // 3. Si pasa a MANTENIMIENTO o FUERA DE SERVICIO -> Crear alerta de incidencia
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

        return new EspacioResource();
    }

    public function destroy(Espacio ): JsonResponse
    {
        ->delete();

        return response()->json([
            'message' => 'Espacio eliminado correctamente',
        ]);
    }
}
