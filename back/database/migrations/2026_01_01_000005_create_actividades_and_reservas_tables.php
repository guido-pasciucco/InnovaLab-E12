<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('actividades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tipo'); // p. ej. curso, practica, workshop
            $table->foreignId('responsable_id')->constrained('usuarios')->onDelete('cascade');
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->integer('participantes_estimados');
            $table->enum('estado', ['programada', 'en_curso', 'finalizada', 'cancelada'])->default('programada');
            $table->timestamps();
        });

        Schema::create('reserva_espacio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actividad_id')->constrained('actividades')->onDelete('cascade');
            $table->foreignId('espacio_id')->constrained('espacios')->onDelete('cascade');
            $table->dateTime('hora_inicio');
            $table->dateTime('hora_fin');
            $table->enum('estado', ['confirmada', 'cancelada', 'pendiente'])->default('confirmada');
            $table->timestamps();
        });

        Schema::create('reserva_equipamiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actividad_id')->constrained('actividades')->onDelete('cascade');
            $table->foreignId('equipamiento_id')->constrained('equipamiento')->onDelete('cascade');
            $table->integer('cantidad');
            $table->dateTime('hora_inicio');
            $table->dateTime('hora_fin');
            $table->enum('estado', ['confirmada', 'cancelada', 'pendiente'])->default('confirmada');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reserva_equipamiento');
        Schema::dropIfExists('reserva_espacio');
        Schema::dropIfExists('actividades');
    }
};
