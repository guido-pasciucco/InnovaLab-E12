<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conflicto', function (Blueprint $table) {
            $table->id();
            $table->string('tipo');
            $table->foreignId('reserva_espacio_id')->nullable()->constrained('reserva_espacio')->onDelete('cascade');
            $table->foreignId('reserva_equipamiento_id')->nullable()->constrained('reserva_equipamiento')->onDelete('cascade');
            $table->foreignId('espacio_id')->nullable()->constrained('espacios')->onDelete('set null'); // Solicitado por Data
            $table->foreignId('equipamiento_id')->nullable()->constrained('equipamiento')->onDelete('set null'); // Solicitado por Data
            $table->dateTime('fecha_detectado');
            $table->boolean('resuelto')->default(false);
            $table->dateTime('fecha_resolucion')->nullable(); // Solicitado por Data (resolved_at)
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });

        Schema::create('alerta', function (Blueprint $table) {
            $table->id();
            $table->string('tipo');
            $table->string('referencia_tipo')->nullable();
            $table->unsignedBigInteger('referencia_id')->nullable();
            $table->dateTime('fecha');
            $table->enum('estado', ['activa', 'resuelta', 'ignorada'])->default('activa');
            $table->dateTime('fecha_resolucion')->nullable(); // Solicitado por Data (resolved_at)
            $table->string('mensaje');
            $table->timestamps();
        });

        Schema::create('consulta_ia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->text('pregunta');
            $table->text('respuesta');
            $table->dateTime('fecha');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consulta_ia');
        Schema::dropIfExists('alerta');
        Schema::dropIfExists('conflicto');
    }
};
