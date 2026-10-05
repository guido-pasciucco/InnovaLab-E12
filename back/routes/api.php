<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspacioController;
use App\Http\Controllers\Api\EquipamientoController;

/*
|--------------------------------------------------------------------------
| API Routes — InnovaLab Backend
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Rutas públicas de Autenticación
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Rutas protegidas mediante Laravel Sanctum
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // ABM Espacios
        Route::apiResource('espacios', EspacioController::class);

        // ABM Equipamiento
        Route::apiResource('equipamiento', EquipamientoController::class);
    });
});
