<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('reservas')) {
            Schema::create('reservas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('actividad_id')->constrained('actividades')->onDelete('cascade');
                $table->foreignId('espacio_id')->constrained('espacios')->onDelete('cascade');
                $table->foreignId('usuario_solicitante_id')->nullable()->constrained('usuarios')->onDelete('set null');
                $table->dateTime('fecha_hora_inicio');
                $table->dateTime('fecha_hora_fin');
                $table->string('estado')->default('confirmada');
                $table->text('observaciones')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('equipamiento_reserva')) {
            Schema::create('equipamiento_reserva', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reserva_id')->constrained('reservas')->onDelete('cascade');
                $table->foreignId('equipamiento_id')->constrained('equipamiento')->onDelete('cascade');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('equipamiento_reserva');
        Schema::dropIfExists('reservas');
    }
};
