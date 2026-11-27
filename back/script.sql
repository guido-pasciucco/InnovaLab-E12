-- Normalizar la tabla de Espacios
UPDATE espacios 
SET nombre = LOWER(nombre),
    tipo = LOWER(tipo), 
    ubicacion = LOWER(ubicacion),
    estado = LOWER(estado);

-- Normalizar la tabla de Equipamiento
UPDATE equipamiento 
SET nombre = LOWER(nombre),
    categoria = LOWER(categoria), 
    tipo_movilidad = LOWER(tipo_movilidad), 
    estado = LOWER(estado);

-- Normalizar Historiales
UPDATE espacio_historial 
SET estado = LOWER(estado),
    motivo = LOWER(motivo)
WHERE motivo IS NOT NULL;

UPDATE equipo_historial 
SET estado = LOWER(estado),
    ubicacion_texto = LOWER(ubicacion_texto),
    motivo = LOWER(motivo)
WHERE motivo IS NOT NULL;

-- Normalizar Usuarios, Roles y Actividades
UPDATE usuarios SET email = LOWER(email), nombre = LOWER(nombre);
UPDATE roles SET nombre = LOWER(nombre);
UPDATE actividades SET titulo = LOWER(titulo), tipo = LOWER(tipo), estado = LOWER(estado);
2. Script de TRUNCATE + INSERT (Para repoblar de cero 100% en minúsculas)
Si preferís reiniciar la base de datos con la estructura real del Centro de Simulación (Pisos 2, 3 y 4) insertando todo directamente en minúsculas:
-- ============================================================
-- REPOBLADO NORMALIZADO A MINÚSCULAS (SEDE 25 DE MAYO 444)
-- ============================================================

-- 1. Limpieza de tablas operativas
TRUNCATE TABLE equipo_historial, espacio_historial, equipamiento, espacios RESTART IDENTITY CASCADE;

-- 2. Insertar Espacios Reales (Pisos 2, 3 y 4)
INSERT INTO espacios (id, nombre, tipo, capacidad, ubicacion, estado, created_at, updated_at) VALUES
(1, 'sum - salón de usos múltiples', 'aula', 80, 'piso 4', 'disponible', NOW(), NOW()),
(2, 'sala 1 - seguridad e higiene', 'laboratorio', 6, 'piso 3', 'disponible', NOW(), NOW()),
(3, 'sala 2 - textil', 'laboratorio', 10, 'piso 3', 'disponible', NOW(), NOW()),
(4, 'sala 3 - realidad aumentada / drones', 'laboratorio', 20, 'piso 3', 'disponible', NOW(), NOW()),
(5, 'sala 4 - robótica y automatización', 'laboratorio', 20, 'piso 3', 'disponible', NOW(), NOW()),
(6, 'sala 5 - inteligencia artificial', 'laboratorio', 15, 'piso 3', 'disponible', NOW(), NOW()),
(7, 'sala 6 - finanzas y simulaciones', 'laboratorio', 16, 'piso 3', 'disponible', NOW(), NOW()),
(8, 'sala 1 - logística i (flota pesada y soldadura)', 'laboratorio', 15, 'piso 2', 'disponible', NOW(), NOW()),
(9, 'sala 2 - logística ii (maquinaria especializada)', 'laboratorio', 15, 'piso 2', 'disponible', NOW(), NOW()),
(10, 'sala 3 - riesgos de trabajo e higiene operativa', 'laboratorio', 12, 'piso 2', 'disponible', NOW(), NOW()),
(11, 'sala 4 - estudio de streaming y radio', 'taller', 10, 'piso 2', 'disponible', NOW(), NOW()),
(12, 'sala 5 - energía / ia', 'laboratorio', 15, 'piso 2', 'disponible', NOW(), NOW()),
(13, 'sala 6 - sustentabilidad', 'laboratorio', 15, 'piso 2', 'disponible', NOW(), NOW());

-- Ajustar secuencia del ID de espacios
SELECT setval('espacios_id_seq', (SELECT MAX(id) FROM espacios));

-- 3. Insertar Equipamiento Real
INSERT INTO equipamiento (nombre, categoria, tipo_movilidad, cantidad, espacio_habitual_id, espacio_actual_id, estado, created_at, updated_at) VALUES
-- Piso 2 (Industrial / Logística / Streaming)
('simulador de flota pesada', 'logística', 'fijo', 2, 8, 8, 'disponible', NOW(), NOW()),
('simulador de soldadura virtual', 'industria', 'fijo', 2, 8, 8, 'disponible', NOW(), NOW()),
('maquinaria logística especializada', 'logística', 'fijo', 3, 9, 9, 'disponible', NOW(), NOW()),
('simulador de riesgos operativos', 'seguridad', 'fijo', 2, 10, 10, 'disponible', NOW(), NOW()),
('consola y micrófonos de streaming', 'audiovisual', 'fijo', 1, 11, 11, 'disponible', NOW(), NOW()),
('cámaras 4k para streaming', 'audiovisual', 'trasladable', 3, 11, 11, 'disponible', NOW(), NOW()),
('módulos de simulación energética', 'energía', 'fijo', 2, 12, 12, 'disponible', NOW(), NOW()),
('equipamiento de prácticas sustentables', 'sustentabilidad', 'fijo', 2, 13, 13, 'disponible', NOW(), NOW()),

-- Piso 3 (Alta Tecnología)
('simulador de gran porte (volante y palanca)', 'seguridad', 'fijo', 1, 2, 2, 'disponible', NOW(), NOW()),
('aparatos de medición e higiene', 'seguridad', 'trasladable', 4, 2, 2, 'disponible', NOW(), NOW()),
('aparato de simulación textil', 'textil', 'fijo', 1, 3, 3, 'disponible', NOW(), NOW()),
('gafas de realidad aumentada para drones', 'tecnología', 'trasladable', 6, 4, 4, 'disponible', NOW(), NOW()),
('simuladores de control de drones', 'tecnología', 'trasladable', 4, 4, 4, 'disponible', NOW(), NOW()),
('equipos industriales de robótica', 'robótica', 'fijo', 3, 5, 5, 'disponible', NOW(), NOW()),
('workstations de inteligencia artificial', 'informática', 'fijo', 5, 6, 6, 'disponible', NOW(), NOW()),
('terminales de simulación financiera', 'finanzas', 'fijo', 4, 7, 7, 'disponible', NOW(), NOW());
