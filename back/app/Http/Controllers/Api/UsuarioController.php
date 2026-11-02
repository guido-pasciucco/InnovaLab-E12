<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Usuario::query()->with('rol');

        if ($request->has('rol_id')) {
            $query->where('rol_id', $request->query('rol_id'));
        }

        if ($request->has('activo')) {
            $query->where('activo', filter_var($request->query('activo'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'data' => UserResource::collection($query->get())
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'rol_id' => 'required|exists:roles,id',
            'activo' => 'boolean',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['activo'] = $data['activo'] ?? true;

        $usuario = Usuario::create($data);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'data' => new UserResource($usuario->load('rol'))
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $usuario = Usuario::with('rol')->findOrFail($id);

        return response()->json([
            'data' => new UserResource($usuario)
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('usuarios', 'email')->ignore($usuario->id)],
            'password' => 'sometimes|string|min:6',
            'rol_id' => 'sometimes|exists:roles,id',
            'activo' => 'sometimes|boolean',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $usuario->update($data);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'data' => new UserResource($usuario->load('rol'))
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }
}
