-- ============================================================
-- CONSULTAS ESTRUCTURADAS PARA MÓDULO DE IA
-- InnovaLab — Centro de Simulación
-- Equipo: BI, Data & IA
-- 
-- Estas queries son la base para el endpoint /api/v1/ai/context-query
-- Cada bloque corresponde a un tipo de pregunta en lenguaje natural
-- que el módulo de IA debe poder responder.
-- ============================================================


-- ============================================================
-- BLOQUE 1 — DISPONIBILIDAD DE ESPACIOS
-- ============================================================

-- Pregunta: "¿Qué laboratorios están disponibles mañana por la tarde?"
-- Parámetros: :tipo (ej: 'laboratorio'), :fecha, :hora_inicio, :hora_fin

SELECT e.id, e.nombre, e.tipo, e.capacidad, e.ubicacion
FROM espacios e
WHERE e.tipo = :tipo
  AND e.estado = 'disponible'
  AND e.id NOT IN (
      SELECT re.espacio_id
      FROM reserva_espacio re
      WHERE re.estado = 'confirmada'
        AND DATE(re.hora_inicio) = :fecha
        AND re.hora_inicio < :hora_fin
        AND re.hora_fin > :hora_inicio
  )
ORDER BY e.capacidad DESC;


-- Pregunta: "¿Qué espacios están disponibles hoy?"
-- Parámetros: :fecha, :hora_actual

SELECT e.id, e.nombre, e.tipo, e.capacidad, e.ubicacion
FROM espacios e
WHERE e.estado = 'disponible'
  AND e.id NOT IN (
      SELECT re.espacio_id
      FROM reserva_espacio re
      WHERE re.estado = 'confirmada'
        AND DATE(re.hora_inicio) = :fecha
        AND re.hora_inicio <= :hora_actual
        AND re.hora_fin >= :hora_actual
  )
ORDER BY e.tipo, e.nombre;


-- Pregunta: "¿Está disponible el Laboratorio A el viernes a las 10?"
-- Parámetros: :nombre_espacio, :fecha, :hora_inicio, :hora_fin

SELECT 
    e.nombre,
    e.estado,
    CASE 
        WHEN e.estado != 'disponible' THEN 'No disponible — estado: ' || e.estado
        WHEN EXISTS (
            SELECT 1 FROM reserva_espacio re
            WHERE re.espacio_id = e.id
              AND re.estado = 'confirmada'
              AND DATE(re.hora_inicio) = :fecha
              AND re.hora_inicio < :hora_fin
              AND re.hora_fin > :hora_inicio
        ) THEN 'Ocupado en ese horario'
        ELSE 'Disponible'
    END AS disponibilidad
FROM espacios e
WHERE e.nombre ILIKE '%' || :nombre_espacio || '%';


-- ============================================================
-- BLOQUE 2 — UTILIZACIÓN Y DEMANDA DE RECURSOS
-- ============================================================

-- Pregunta: "¿Qué recursos tuvieron mayor utilización este mes?"
-- Parámetros: :anio, :mes

SELECT 
    eq.nombre,
    eq.categoria,
    eq.tipo_movilidad,
    COUNT(re.id) AS veces_reservado,
    SUM(re.cantidad) AS unidades_totales_reservadas,
    SUM(
        EXTRACT(EPOCH FROM (re.hora_fin - re.hora_inicio)) / 3600
    ) AS horas_en_uso
FROM equipamiento eq
LEFT JOIN reserva_equipamiento re ON re.equipamiento_id = eq.id
    AND re.estado = 'confirmada'
    AND EXTRACT(YEAR FROM re.hora_inicio) = :anio
    AND EXTRACT(MONTH FROM re.hora_inicio) = :mes
GROUP BY eq.id, eq.nombre, eq.categoria, eq.tipo_movilidad
ORDER BY veces_reservado DESC, horas_en_uso DESC
LIMIT 10;


-- Pregunta: "¿Qué espacio tuvo menor nivel de ocupación durante agosto?"
-- Parámetros: :anio, :mes

SELECT 
    e.nombre,
    e.tipo,
    e.capacidad,
    COUNT(re.id) AS cantidad_reservas,
    COALESCE(SUM(
        EXTRACT(EPOCH FROM (re.hora_fin - re.hora_inicio)) / 3600
    ), 0) AS horas_ocupadas
FROM espacios e
LEFT JOIN reserva_espacio re ON re.espacio_id = e.id
    AND re.estado = 'confirmada'
    AND EXTRACT(YEAR FROM re.hora_inicio) = :anio
    AND EXTRACT(MONTH FROM re.hora_inicio) = :mes
GROUP BY e.id, e.nombre, e.tipo, e.capacidad
ORDER BY horas_ocupadas ASC, cantidad_reservas ASC;


-- Pregunta: "¿Qué horarios tienen mayor demanda?"

SELECT 
    EXTRACT(HOUR FROM re.hora_inicio) AS hora,
    COUNT(re.id) AS cantidad_reservas
FROM reserva_espacio re
WHERE re.estado = 'confirmada'
GROUP BY hora
ORDER BY cantidad_reservas DESC;


-- ============================================================
-- BLOQUE 3 — ACTIVIDADES Y RESERVAS
-- ============================================================

-- Pregunta: "¿Qué actividades tienen equipamiento pendiente?"

SELECT 
    a.id,
    a.nombre,
    a.tipo,
    a.fecha,
    a.hora_inicio,
    a.participantes_estimados,
    u.nombre AS responsable
FROM actividades a
LEFT JOIN reserva_equipamiento re ON re.actividad_id = a.id
    AND re.estado = 'confirmada'
LEFT JOIN usuarios u ON u.id = a.responsable_id
WHERE a.estado = 'programada'
  AND re.id IS NULL
ORDER BY a.fecha ASC, a.hora_inicio ASC;


-- Pregunta: "¿Qué actividades están programadas esta semana?"
-- Parámetros: :fecha_inicio_semana, :fecha_fin_semana

SELECT 
    a.id,
    a.nombre,
    a.tipo,
    a.fecha,
    a.hora_inicio,
    a.hora_fin,
    a.participantes_estimados,
    a.estado,
    u.nombre AS responsable,
    e.nombre AS espacio_asignado
FROM actividades a
LEFT JOIN usuarios u ON u.id = a.responsable_id
LEFT JOIN reserva_espacio re ON re.actividad_id = a.id AND re.estado = 'confirmada'
LEFT JOIN espacios e ON e.id = re.espacio_id
WHERE a.fecha BETWEEN :fecha_inicio_semana AND :fecha_fin_semana
ORDER BY a.fecha ASC, a.hora_inicio ASC;


-- Pregunta: "¿Qué actividades no tienen espacio asignado?"

SELECT 
    a.id,
    a.nombre,
    a.tipo,
    a.fecha,
    a.hora_inicio,
    a.participantes_estimados,
    u.nombre AS responsable
FROM actividades a
LEFT JOIN usuarios u ON u.id = a.responsable_id
LEFT JOIN reserva_espacio re ON re.actividad_id = a.id AND re.estado = 'confirmada'
WHERE a.estado = 'programada'
  AND re.id IS NULL
ORDER BY a.fecha ASC;


-- ============================================================
-- BLOQUE 4 — EQUIPAMIENTO
-- ============================================================

-- Pregunta: "¿Qué equipamiento está fuera de servicio?"

SELECT 
    eq.nombre,
    eq.categoria,
    eq.tipo_movilidad,
    eq.estado,
    e.nombre AS espacio_habitual,
    eh.motivo AS motivo_ultimo_cambio,
    eh.fecha_inicio AS desde
FROM equipamiento eq
LEFT JOIN espacios e ON e.id = eq.espacio_habitual_id
LEFT JOIN equipo_historial eh ON eh.equipamiento_id = eq.id
    AND eh.fecha_fin IS NULL
WHERE eq.estado IN ('fuera_de_servicio', 'mantenimiento')
ORDER BY eq.estado, eq.nombre;


-- Pregunta: "¿Dónde está el equipamiento trasladable ahora?"

SELECT 
    eq.nombre,
    eq.categoria,
    eq.estado,
    eh.nombre AS espacio_habitual,
    ea.nombre AS ubicacion_actual
FROM equipamiento eq
LEFT JOIN espacios eh ON eh.id = eq.espacio_habitual_id
LEFT JOIN espacios ea ON ea.id = eq.espacio_actual_id
WHERE eq.tipo_movilidad = 'trasladable'
ORDER BY eq.nombre;


-- ============================================================
-- BLOQUE 5 — CONFLICTOS Y ALERTAS
-- ============================================================

-- Pregunta: "¿Cuántos conflictos hay sin resolver?"

SELECT 
    tipo,
    COUNT(*) AS cantidad,
    MIN(fecha_detectado) AS conflicto_mas_antiguo
FROM conflicto
WHERE resuelto = FALSE
GROUP BY tipo
ORDER BY cantidad DESC;


-- Pregunta: "¿Qué alertas están activas?"

SELECT 
    tipo,
    mensaje,
    fecha,
    referencia_tipo,
    referencia_id
FROM alerta
WHERE estado = 'activa'
ORDER BY fecha DESC;


-- ============================================================
-- BLOQUE 6 — RESUMEN OPERATIVO GENERAL
-- ============================================================

-- Pregunta: "Dame un resumen del estado actual del centro"
-- Esta query devuelve todos los KPIs en una sola llamada

SELECT
    (SELECT COUNT(*) FROM actividades WHERE estado = 'programada') AS actividades_programadas,
    (SELECT COUNT(*) FROM actividades WHERE estado = 'en_curso') AS actividades_en_curso,
    (SELECT COUNT(*) FROM espacios WHERE estado = 'disponible') AS espacios_disponibles,
    (SELECT COUNT(*) FROM espacios WHERE estado = 'mantenimiento') AS espacios_en_mantenimiento,
    (SELECT COUNT(*) FROM espacios WHERE estado = 'fuera_de_servicio') AS espacios_fuera_servicio,
    (SELECT COUNT(*) FROM equipamiento WHERE estado = 'disponible') AS equipamiento_disponible,
    (SELECT COUNT(*) FROM equipamiento WHERE estado = 'fuera_de_servicio') AS equipamiento_fuera_servicio,
    (SELECT COUNT(*) FROM reserva_espacio WHERE estado = 'confirmada' AND DATE(hora_inicio) = CURRENT_DATE) AS reservas_hoy,
    (SELECT COUNT(*) FROM conflicto WHERE resuelto = FALSE) AS conflictos_pendientes,
    (SELECT COUNT(*) FROM alerta WHERE estado = 'activa') AS alertas_activas;
