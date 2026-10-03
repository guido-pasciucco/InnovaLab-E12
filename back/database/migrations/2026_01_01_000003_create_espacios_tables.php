<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('espacios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tipo'); // p. ej. aula, laboratorio, taller
            $table->integer('capacidad');
            $table->string('ubicacion');
            $table->enum('estado', ['disponible', 'mantenimiento', 'fuera_de_servicio'])->default('disponible');
            $table->timestamps();
        });

        Schema::create('espacio_historial', function (Blueprint $table) {
            $table->id();
            $table->foreignId('espacio_id')->constrained('espacios')->onDelete('cascade');
            $table->string('estado');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin')->nullable();
            $table->string('motivo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('espacio_historial');
        Schema::dropIfExists('espacios');
    }
};
