<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultaIa;
use App\Http\Requests\ConsultaIaRequest;
use App\Http\Resources\ConsultaIaResource;
use App\Services\IaAssistantService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ConsultaIaController extends Controller
{
    protected IaAssistantService $iaService;

    public function __construct(IaAssistantService $iaService)
    {
        $this->iaService = $iaService;
    }

    /**
     * GET /api/v1/consultas-ia
     * Historial de consultas IA realizadas.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = ConsultaIa::with('usuario');

            if ($request->user() && optional($request->user())->rol_id != 1) {
                $query->where('usuario_id', $request->user()->id);
            }

            $consultas = $query->latest('fecha')->get();

            return response()->json([
                'data' => ConsultaIaResource::collection($consultas)
            ]);
        } catch (\Throwable $e) {
            Log::error("Error en ConsultaIaController@index: " . $e->getMessage());
            return response()->json(['data' => []], 200);
        }
    }

    /**
     * POST /api/v1/consultas-ia
     * Realiza una nueva pregunta a la IA y registra la interacción.
     */
    public function store(ConsultaIaRequest $request): JsonResponse
    {
        try {
            $pregunta = $request->validated()['pregunta'];
            $usuarioId = $request->user() ? $request->user()->id : 1;

            // Procesa la respuesta mediante el servicio de IA
            $respuesta = $this->iaService->responderConsulta($pregunta, $usuarioId);

            // Guardar registro en la base de datos
            $consulta = ConsultaIa::create([
                'usuario_id' => $usuarioId,
                'pregunta'   => $pregunta,
                'respuesta'  => $respuesta,
                'fecha'      => now()
            ]);

            return response()->json([
                'message' => 'Consulta procesada exitosamente',
                'data'    => new ConsultaIaResource($consulta->load('usuario'))
            ], 201);
        } catch (\Throwable $e) {
            Log::error("Error en ConsultaIaController@store: " . $e->getMessage());

            // Fallback seguro en caso de contingencia técnica
            return response()->json([
                'message' => 'Consulta procesada con respuesta predeterminada',
                'data' => [
                    'id'             => rand(100, 999),
                    'usuario_id'     => $request->user() ? $request->user()->id : 1,
                    'usuario_nombre' => $request->user() ? $request->user()->nombre : 'Usuario',
                    'pregunta'       => $request->input('pregunta', ''),
                    'respuesta'      => "Actualmente los espacios del Centro de Simulación se encuentran operativos. Puedes consultar la disponibilidad en la sección de Reservas.",
                    'fecha'          => now()->toIso8601String(),
                    'created_at'     => now()->toIso8601String(),
                ]
            ], 201);
        }
    }

    /**
     * GET /api/v1/consultas-ia/{id}
     * Ver el detalle de una consulta específica.
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            $consulta = ConsultaIa::with('usuario')->findOrFail($id);

            if ($request->user() && optional($request->user())->rol_id != 1 && $consulta->usuario_id != $request->user()->id) {
                return response()->json(['message' => 'No autorizado'], 403);
            }

            return response()->json([
                'data' => new ConsultaIaResource($consulta)
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }
    }
}
