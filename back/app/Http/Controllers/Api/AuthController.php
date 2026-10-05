<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Iniciar sesión y emitir token Bearer (Laravel Sanctum).
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $usuario = Usuario::with('rol')->where('email', $request->email)->first();

        if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales ingresadas son incorrectas.'],
            ]);
        }

        if (! $usuario->activo) {
            return response()->json([
                'message' => 'El usuario se encuentra inactivo. Contacte al administrador.'
            ], 403);
        }

        // Crear token Sanctum
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'usuario' => new UserResource($usuario),
        ]);
    }

    /**
     * Cerrar sesión y revocar el token actual del usuario.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    /**
     * Obtener perfil del usuario autenticado.
     */
    public function me(Request $request): JsonResponse
    {
        $usuario = $request->user()->load('rol');

        return response()->json([
            'usuario' => new UserResource($usuario)
        ]);
    }
}
