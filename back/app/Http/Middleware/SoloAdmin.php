<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SoloAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if (!$usuario || ($usuario->rol_id !== 1 && !$usuario->es_admin)) {
            return response()->json([
                'message' => 'Acceso no autorizado. Se requieren permisos de Administrador.'
            ], 403);
        }

        return $next($request);
    }
}