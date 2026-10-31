<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SoloAdmin
{
    /**
     * Permite el acceso únicamente si el usuario tiene rol Administrador (rol_id == 1).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || ($user->rol_id !== 1 && strtolower($user->rol?->nombre ?? '') !== 'administrador')) {
            return response()->json([
                'message' => 'Acceso denegado. Se requieren permisos de Administrador para gestionar usuarios.'
            ], 403);
        }

        return $next($request);
    }
}
