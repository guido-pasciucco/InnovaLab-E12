<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipamiento', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('categoria');
            $table->enum('tipo_movilidad', ['fijo', 'trasladable'])->default('fijo');
            $table->integer('cantidad')->default(1);
            $table->foreignId('espacio_habitual_id')->nullable()->constrained('espacios')->onDelete('set null');
            $table->enum('estado', ['disponible', 'mantenimiento', 'fuera_de_servicio'])->default('disponible');
            $table->timestamps();
        });

        Schema::create('equipo_historial', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipamiento_id')->constrained('equipamiento')->onDelete('cascade');
            $table->string('estado');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin')->nullable();
            $table->string('motivo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipo_historial');
        Schema::dropIfExists('equipamiento');
    }
};
