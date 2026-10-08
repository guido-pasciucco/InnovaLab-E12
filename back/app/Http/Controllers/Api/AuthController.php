<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Inicio de sesión y generación de token Sanctum.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Busca el usuario usando el modelo User (conectado a la tabla 'usuarios')
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales ingresadas son incorrectas.',
                'errors' => [
                    'email' => ['Las credenciales ingresadas son incorrectas.']
                ]
            ], 401);
        }

        // Genera el token de acceso
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'access_token' => $token,
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Cierre de sesión (revoca el token actual).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.'
        ]);
    }

    /**
     * Obtiene los datos del usuario autenticado.
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}