<?php

namespace App\Services;

use App\Models\Espacio;
use App\Models\Equipamiento;
use App\Models\Reserva;
use App\Models\Alerta;
use Carbon\Carbon;

class IaAssistantService
{
    /**
     * Procesa consultas en lenguaje natural analizando la BD en tiempo real
     */
    public function responderConsulta(string $pregunta, $usuario): string
    {
        $q = strtolower($pregunta);

        // 1. Disponibilidad de espacios o salas
        if (str_contains($q, 'espacio') || str_contains($q, 'sala') || str_contains($q, 'libre') || str_contains($q, 'disponible')) {
            $hoy = Carbon::today();
            $operativos = Espacio::where('estado', 'operativo')->count();
            $mantenimiento = Espacio::where('estado', 'mantenimiento')->count();
            $reservasHoy = Reserva::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'confirmada')->count();

            return "Actualmente hay {$operativos} espacios operativos y {$mantenimiento} en mantenimiento. Para hoy hay {$reservasHoy} reservas confirmadas.";
        }

        // 2. Estado de equipamiento / simuladores
        if (str_contains($q, 'equipo') || str_contains($q, 'simulador') || str_contains($q, 'mantenimiento') || str_contains($q, 'falla')) {
            $fueraDeServicio = Equipamiento::whereIn('estado', ['mantenimiento', 'fuera_de_servicio'])->get(['nombre', 'estado']);
            
            if ($fueraDeServicio->isEmpty()) {
                return "Todos los equipos y simuladores registrados se encuentran actualmente en estado disponible.";
            }

            $lista = $fueraDeServicio->map(fn($e) => "{$e->nombre} ({$e->estado})")->implode(', ');
            return "Los siguientes equipos requieren atención o están fuera de servicio: {$lista}.";
        }

        // 3. Alertas o conflictos
        if (str_contains($q, 'alerta') || str_contains($q, 'conflicto') || str_contains($q, 'problema') || str_contains($q, 'incidencia')) {
            $alertasActivas = Alerta::where('estado', 'activa')->count();
            return "El sistema registra actualmente {$alertasActivas} alertas/incidencias activas pendientes de resolución por parte de coordinación.";
        }

        // 4. Respuesta general
        return "Hola {$usuario->nombre}. Podés consultarme sobre disponibilidad de salas, estado de simuladores, conflictos de reservas o alertas del sistema.";
    }
}
B. Controlador de IA (app/Http/Controllers/Api/ConsultaIaController.php):
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultaIa;
use App\Services\IaAssistantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConsultaIaController extends Controller
{
    protected $iaService;

    public function __construct(IaAssistantService $iaService)
    {
        $this->iaService = $iaService;
    }

    public function index()
    {
        $usuario = Auth::user();
        $query = ConsultaIa::with('usuario:id,nombre,email')->orderBy('created_at', 'desc');

        if ($usuario->rol_id !== 1) {
            $query->where('usuario_id', $usuario->id);
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'pregunta' => 'required|string|max:1000',
        ]);

        $usuario = Auth::user();
        $pregunta = $request->input('pregunta');
        $respuesta = $this->iaService->responderConsulta($pregunta, $usuario);

        $consulta = ConsultaIa::create([
            'usuario_id' => $usuario->id,
            'pregunta' => $pregunta,
            'respuesta' => $respuesta,
            'fecha' => now(),
        ]);

        return response()->json([
            'message' => 'Consulta procesada exitosamente',
            'data' => $consulta,
        ], 201);
    }
}
