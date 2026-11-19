<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultaIa;
use App\Http\Requests\ConsultaIaRequest;
use App\Http\Resources\ConsultaIaResource;
use App\Services\IaAssistantService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConsultaIaController extends Controller
{
    protected IaAssistantService $iaService;

    public function __construct(IaAssistantService $iaService)
    {
        $this->iaService = $iaService;
    }

    /**
     * Historial de consultas IA realizadas por el usuario o administradores.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ConsultaIa::with('usuario');

        // Si no es admin, solo ve sus propias consultas
        if ($request->user()->rol_id != 1) {
            $query->where('usuario_id', $request->user()->id);
        }

        $consultas = $query->latest('fecha')->get();

        return response()->json([
            'data' => ConsultaIaResource::collection($consultas)
        ]);
    }

    /**
     * Realiza una nueva pregunta a la IA y registra la interacción.
     */
    public function store(ConsultaIaRequest $request): JsonResponse
    {
        $pregunta = $request->validated()['pregunta'];
        $usuarioId = $request->user()->id;

        // Procesa la respuesta mediante el servicio de IA
        $respuesta = $this->iaService->responderConsulta($pregunta, $usuarioId);

        $consulta = ConsultaIa::create([
            'usuario_id' => $usuarioId,
            'pregunta' => $pregunta,
            'respuesta' => $respuesta,
            'fecha' => now()
        ]);

        return response()->json([
            'message' => 'Consulta procesada exitosamente',
            'data' => new ConsultaIaResource($consulta->load('usuario'))
        ], 201);
    }

    /**
     * Ver el detalle de una consulta específica.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $consulta = ConsultaIa::with('usuario')->findOrFail($id);

        if ($request->user()->rol_id != 1 && $consulta->usuario_id != $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json([
            'data' => new ConsultaIaResource($consulta)
        ]);
    }
}