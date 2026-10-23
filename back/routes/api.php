<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspacioController;
use App\Http\Controllers\Api\EquipamientoController;
use App\Http\Controllers\Api\ActividadController;
use App\Http\Controllers\Api\ReservaController;
use App\Http\Controllers\Api\AlertaController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ConsultaIaController;

/*
|--------------------------------------------------------------------------
| Rutas de la API v1 - Centro de Simulación InnovaLab
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. Autenticación Pública
    Route::post('/auth/login', [AuthController::class, 'login']);

    // 2. Rutas Protegidas por Sanctum
    Route::middleware('auth:sanctum')->group(function () {

        // Auth Sesión
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // ABM Recursos
        Route::apiResource('espacios', EspacioController::class);
        Route::apiResource('equipamiento', EquipamientoController::class);
        Route::apiResource('actividades', ActividadController::class);
        Route::apiResource('reservas', ReservaController::class);

        // Alertas e Incidencias
        Route::get('/alertas', [AlertaController::class, 'index']);
        Route::post('/alertas', [AlertaController::class, 'store']);
        Route::put('/alertas/{id}/resolver', [AlertaController::class, 'resolver']);

        // Dashboard & Métricas (Sprint 3)
        Route::prefix('dashboard')->group(function () {
            Route::get('/resumen', [DashboardController::class, 'resumen']);
            Route::get('/ocupacion-espacios', [DashboardController::class, 'ocupacionEspacios']);
            Route::get('/uso-equipamiento', [DashboardController::class, 'usoEquipamiento']);
            Route::get('/metricas-conflictos', [DashboardController::class, 'metricasConflictos']);
        });

        // Asistente IA (Sprint 4)
        Route::get('/consultas-ia', [ConsultaIaController::class, 'index']);
        Route::post('/consultas-ia', [ConsultaIaController::class, 'store']);

    });

});
