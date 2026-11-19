-- ============================================================
-- BASE DE DATOS LOCAL — InnovaLab Centro de Simulación
-- Generado desde migraciones de Laravel (feature/backend)
-- Usar en: PostgreSQL / MySQL / DBeaver / pgAdmin / TablePlus
-- ============================================================

-- Si ya existe la base, la limpiamos (opcional)
-- DROP SCHEMA public CASCADE; CREATE SCHEMA public;

-- ============================================================
-- 1. ROLES Y PERMISOS
-- ============================================================

CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    nombre      VARCHAR(255) NOT NULL UNIQUE,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE permisos (
    id          BIGSERIAL PRIMARY KEY,
    nombre      VARCHAR(255) NOT NULL UNIQUE,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE rol_permiso (
    rol_id      BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id  BIGINT NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

-- ============================================================
-- 2. USUARIOS
-- ============================================================

CREATE TABLE usuarios (
    id              BIGSERIAL PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    rol_id          BIGINT REFERENCES roles(id) ON DELETE SET NULL,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    remember_token  VARCHAR(100),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

-- ============================================================
-- 3. ESPACIOS E HISTORIAL DE ESPACIOS
-- ============================================================

CREATE TABLE espacios (
    id          BIGSERIAL PRIMARY KEY,
    nombre      VARCHAR(255) NOT NULL,
    tipo        VARCHAR(255) NOT NULL,  -- aula | laboratorio | taller | otro
    capacidad   INTEGER NOT NULL,
    ubicacion   VARCHAR(255) NOT NULL,
    estado      VARCHAR(50) NOT NULL DEFAULT 'disponible',
                -- valores: disponible | mantenimiento | fuera_de_servicio
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE espacio_historial (
    id          BIGSERIAL PRIMARY KEY,
    espacio_id  BIGINT NOT NULL REFERENCES espacios(id) ON DELETE CASCADE,
    estado      VARCHAR(255) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin   TIMESTAMP,
    motivo      VARCHAR(255),
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

-- ============================================================
-- 4. EQUIPAMIENTO E HISTORIAL DE EQUIPAMIENTO
-- ============================================================

CREATE TABLE equipamiento (
    id                  BIGSERIAL PRIMARY KEY,
    nombre              VARCHAR(255) NOT NULL,
    categoria           VARCHAR(255) NOT NULL,
    tipo_movilidad      VARCHAR(50) NOT NULL DEFAULT 'fijo',
                        -- valores: fijo | trasladable
    cantidad            INTEGER NOT NULL DEFAULT 1,
    espacio_habitual_id BIGINT REFERENCES espacios(id) ON DELETE SET NULL,
    espacio_actual_id   BIGINT REFERENCES espacios(id) ON DELETE SET NULL,
                        -- solicitado por Data: FK para ubicación actual (current_space_id)
    estado              VARCHAR(50) NOT NULL DEFAULT 'disponible',
                        -- valores: disponible | mantenimiento | fuera_de_servicio
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP
);

CREATE TABLE equipo_historial (
    id              BIGSERIAL PRIMARY KEY,
    equipamiento_id BIGINT NOT NULL REFERENCES equipamiento(id) ON DELETE CASCADE,
    estado          VARCHAR(255) NOT NULL,
    espacio_id      BIGINT REFERENCES espacios(id) ON DELETE SET NULL,
    ubicacion_texto VARCHAR(255),
    fecha_inicio    TIMESTAMP NOT NULL,
    fecha_fin       TIMESTAMP,
    motivo          VARCHAR(255),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

-- ============================================================
-- 5. ACTIVIDADES, RESERVA DE ESPACIO Y RESERVA DE EQUIPAMIENTO
-- ============================================================

CREATE TABLE actividades (
    id                      BIGSERIAL PRIMARY KEY,
    nombre                  VARCHAR(255) NOT NULL,
    tipo                    VARCHAR(255) NOT NULL,
                            -- valores: curso | practica | workshop | capacitacion | otro
    responsable_id          BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha                   DATE NOT NULL,
    hora_inicio             TIME NOT NULL,
    hora_fin                TIME NOT NULL,
    participantes_estimados INTEGER NOT NULL,
    estado                  VARCHAR(50) NOT NULL DEFAULT 'programada',
                            -- valores: programada | en_curso | finalizada | cancelada
    created_at              TIMESTAMP,
    updated_at              TIMESTAMP
);

CREATE TABLE reserva_espacio (
    id              BIGSERIAL PRIMARY KEY,
    actividad_id    BIGINT NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    espacio_id      BIGINT NOT NULL REFERENCES espacios(id) ON DELETE CASCADE,
    hora_inicio     TIMESTAMP NOT NULL,
    hora_fin        TIMESTAMP NOT NULL,
    estado          VARCHAR(50) NOT NULL DEFAULT 'confirmada',
                    -- valores: confirmada | cancelada | pendiente
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

CREATE TABLE reserva_equipamiento (
    id              BIGSERIAL PRIMARY KEY,
    actividad_id    BIGINT NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    equipamiento_id BIGINT NOT NULL REFERENCES equipamiento(id) ON DELETE CASCADE,
    cantidad        INTEGER NOT NULL,
    hora_inicio     TIMESTAMP NOT NULL,
    hora_fin        TIMESTAMP NOT NULL,
    estado          VARCHAR(50) NOT NULL DEFAULT 'confirmada',
                    -- valores: confirmada | cancelada | pendiente
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

-- ============================================================
-- 6. CONFLICTOS, ALERTAS Y CONSULTAS IA
-- ============================================================

CREATE TABLE conflicto (
    id                      BIGSERIAL PRIMARY KEY,
    tipo                    VARCHAR(255) NOT NULL,
    reserva_espacio_id      BIGINT REFERENCES reserva_espacio(id) ON DELETE CASCADE,
    reserva_equipamiento_id BIGINT REFERENCES reserva_equipamiento(id) ON DELETE CASCADE,
    espacio_id              BIGINT REFERENCES espacios(id) ON DELETE SET NULL,
                            -- solicitado por Data: FK directa para queries analíticas
    equipamiento_id         BIGINT REFERENCES equipamiento(id) ON DELETE SET NULL,
                            -- solicitado por Data: FK directa para queries analíticas
    fecha_detectado         TIMESTAMP NOT NULL,
    resuelto                BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_resolucion        TIMESTAMP,
                            -- solicitado por Data: para medir tiempo de resolución
    descripcion             TEXT,
    created_at              TIMESTAMP,
    updated_at              TIMESTAMP
);

CREATE TABLE alerta (
    id               BIGSERIAL PRIMARY KEY,
    tipo             VARCHAR(255) NOT NULL,
    referencia_tipo  VARCHAR(255),
    referencia_id    BIGINT,
    fecha            TIMESTAMP NOT NULL,
    estado           VARCHAR(50) NOT NULL DEFAULT 'activa',
                     -- valores: activa | resuelta | ignorada
    fecha_resolucion TIMESTAMP,
                     -- solicitado por Data: para historial de resolución
    mensaje          VARCHAR(255) NOT NULL,
    created_at       TIMESTAMP,
    updated_at       TIMESTAMP
);

CREATE TABLE consulta_ia (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pregunta    TEXT NOT NULL,
    respuesta   TEXT NOT NULL,
    fecha       TIMESTAMP NOT NULL,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

-- ============================================================
-- 7. DATOS DE PRUEBA — para empezar a testear queries
-- ============================================================

-- Roles
INSERT INTO roles (nombre, created_at, updated_at) VALUES
    ('Administrador', NOW(), NOW()),
    ('Gestión/Coordinación', NOW(), NOW());

-- Permisos básicos
INSERT INTO permisos (nombre, created_at, updated_at) VALUES
    ('gestionar_usuarios', NOW(), NOW()),
    ('gestionar_espacios', NOW(), NOW()),
    ('gestionar_equipamiento', NOW(), NOW()),
    ('gestionar_actividades', NOW(), NOW()),
    ('ver_dashboard', NOW(), NOW()),
    ('consultar_ia', NOW(), NOW());

-- Rol Administrador tiene todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6);

-- Rol Gestión tiene permisos operativos
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
    (2, 3), (2, 4), (2, 5), (2, 6);

-- Usuarios de prueba
INSERT INTO usuarios (nombre, email, password, rol_id, activo, created_at, updated_at) VALUES
    ('Admin InnovaLab', 'admin@innovalab.edu.ar', 'hashed_password', 1, TRUE, NOW(), NOW()),
    ('Coordinadora Ana', 'ana@innovalab.edu.ar', 'hashed_password', 2, TRUE, NOW(), NOW()),
    ('Coordinador Carlos', 'carlos@innovalab.edu.ar', 'hashed_password', 2, TRUE, NOW(), NOW());

-- Espacios
INSERT INTO espacios (nombre, tipo, capacidad, ubicacion, estado, created_at, updated_at) VALUES
    ('Laboratorio de Simulación A', 'laboratorio', 20, 'Piso 1 - Ala Norte', 'disponible', NOW(), NOW()),
    ('Laboratorio de Simulación B', 'laboratorio', 15, 'Piso 1 - Ala Norte', 'disponible', NOW(), NOW()),
    ('Aula 101', 'aula', 30, 'Piso 1 - Ala Sur', 'disponible', NOW(), NOW()),
    ('Taller de Práctica', 'taller', 25, 'Piso 2 - Ala Norte', 'disponible', NOW(), NOW()),
    ('Sala de Capacitación', 'aula', 40, 'Piso 2 - Ala Sur', 'mantenimiento', NOW(), NOW());

-- Historial de estados de espacios
INSERT INTO espacio_historial (espacio_id, estado, fecha_inicio, fecha_fin, motivo, created_at, updated_at) VALUES
    (5, 'mantenimiento', '2026-09-15 08:00:00', NULL, 'Refacción de instalaciones eléctricas', NOW(), NOW()),
    (1, 'mantenimiento', '2026-08-01 08:00:00', '2026-08-10 18:00:00', 'Limpieza profunda', NOW(), NOW());

-- Equipamiento
INSERT INTO equipamiento (nombre, categoria, tipo_movilidad, cantidad, espacio_habitual_id, espacio_actual_id, estado, created_at, updated_at) VALUES
    ('Simulador de Alta Fidelidad', 'Médico', 'fijo', 2, 1, 1, 'disponible', NOW(), NOW()),
    ('Simulador de Media Fidelidad', 'Médico', 'fijo', 3, 2, 2, 'disponible', NOW(), NOW()),
    ('Notebook Dell', 'Informática', 'trasladable', 15, 1, 1, 'disponible', NOW(), NOW()),
    ('Proyector Epson', 'Audiovisual', 'trasladable', 4, 3, 3, 'disponible', NOW(), NOW()),
    ('Monitor de Signos Vitales', 'Médico', 'fijo', 2, 1, 1, 'fuera_de_servicio', NOW(), NOW()),
    ('Tablet Samsung', 'Informática', 'trasladable', 10, 2, 2, 'disponible', NOW(), NOW());

-- Historial de equipamiento
INSERT INTO equipo_historial (equipamiento_id, estado, espacio_id, ubicacion_texto, fecha_inicio, fecha_fin, motivo, created_at, updated_at) VALUES
    (5, 'fuera_de_servicio', 1, 'Laboratorio de Simulación A', '2026-09-20 10:00:00', NULL, 'Falla en sensor de presión', NOW(), NOW()),
    (3, 'disponible', 1, 'Laboratorio de Simulación A', '2026-09-01 08:00:00', NULL, 'Asignación inicial', NOW(), NOW());

-- Actividades
INSERT INTO actividades (nombre, tipo, responsable_id, fecha, hora_inicio, hora_fin, participantes_estimados, estado, created_at, updated_at) VALUES
    ('RCP Avanzado - Grupo 1', 'practica', 2, '2026-10-05', '09:00', '12:00', 18, 'finalizada', NOW(), NOW()),
    ('Taller de Simulación Obstétrica', 'workshop', 2, '2026-10-07', '14:00', '17:00', 12, 'finalizada', NOW(), NOW()),
    ('Curso de Trauma Pediátrico', 'curso', 3, '2026-10-10', '09:00', '13:00', 20, 'programada', NOW(), NOW()),
    ('Capacitación en Soporte Vital', 'capacitacion', 2, '2026-10-12', '10:00', '14:00', 15, 'programada', NOW(), NOW()),
    ('RCP Básico - Grupo 2', 'practica', 3, '2026-10-15', '09:00', '11:00', 25, 'programada', NOW(), NOW()),
    ('Workshop Emergencias Neonatales', 'workshop', 2, '2026-10-15', '09:00', '12:00', 14, 'programada', NOW(), NOW());

-- Reservas de espacio
INSERT INTO reserva_espacio (actividad_id, espacio_id, hora_inicio, hora_fin, estado, created_at, updated_at) VALUES
    (1, 1, '2026-10-05 09:00:00', '2026-10-05 12:00:00', 'confirmada', NOW(), NOW()),
    (2, 2, '2026-10-07 14:00:00', '2026-10-07 17:00:00', 'confirmada', NOW(), NOW()),
    (3, 1, '2026-10-10 09:00:00', '2026-10-10 13:00:00', 'confirmada', NOW(), NOW()),
    (4, 4, '2026-10-12 10:00:00', '2026-10-12 14:00:00', 'confirmada', NOW(), NOW()),
    (5, 3, '2026-10-15 09:00:00', '2026-10-15 11:00:00', 'confirmada', NOW(), NOW());
    -- actividad 6 sin espacio asignado todavía (para probar alertas)

-- Reservas de equipamiento
INSERT INTO reserva_equipamiento (actividad_id, equipamiento_id, cantidad, hora_inicio, hora_fin, estado, created_at, updated_at) VALUES
    (1, 1, 2, '2026-10-05 09:00:00', '2026-10-05 12:00:00', 'confirmada', NOW(), NOW()),
    (1, 3, 10, '2026-10-05 09:00:00', '2026-10-05 12:00:00', 'confirmada', NOW(), NOW()),
    (2, 2, 3, '2026-10-07 14:00:00', '2026-10-07 17:00:00', 'confirmada', NOW(), NOW()),
    (3, 1, 2, '2026-10-10 09:00:00', '2026-10-10 13:00:00', 'confirmada', NOW(), NOW()),
    (3, 3, 15, '2026-10-10 09:00:00', '2026-10-10 13:00:00', 'confirmada', NOW(), NOW()),
    (4, 4, 1, '2026-10-12 10:00:00', '2026-10-12 14:00:00', 'confirmada', NOW(), NOW());

-- Conflictos de prueba
INSERT INTO conflicto (tipo, reserva_espacio_id, espacio_id, fecha_detectado, resuelto, descripcion, created_at, updated_at) VALUES
    ('superposicion_horario', NULL, 1, '2026-10-09 15:30:00', TRUE, 'Se intentó reservar Lab A el 10/10 con solapamiento detectado y corregido', NOW(), NOW()),
    ('recursos_insuficientes', NULL, NULL, '2026-10-11 10:00:00', FALSE, 'Actividad 6 sin espacio asignado — requiere espacio para 14 personas', NOW(), NOW());

-- Alertas de prueba
INSERT INTO alerta (tipo, referencia_tipo, referencia_id, fecha, estado, mensaje, created_at, updated_at) VALUES
    ('equipamiento_fuera_de_servicio', 'equipamiento', 5, '2026-09-20 10:00:00', 'activa', 'Monitor de Signos Vitales fuera de servicio', NOW(), NOW()),
    ('espacio_no_disponible', 'espacio', 5, '2026-09-15 08:00:00', 'activa', 'Sala de Capacitación en mantenimiento', NOW(), NOW()),
    ('actividad_sin_espacio', 'actividad', 6, '2026-10-11 10:00:00', 'activa', 'Workshop Emergencias Neonatales sin espacio asignado', NOW(), NOW());

-- Consultas IA de prueba
INSERT INTO consulta_ia (usuario_id, pregunta, respuesta, fecha, created_at, updated_at) VALUES
    (2, '¿Qué laboratorios están disponibles mañana por la tarde?', 'Lab A disponible de 13:00 a 18:00. Lab B disponible todo el día.', '2026-10-09 09:00:00', NOW(), NOW()),
    (3, '¿Qué equipamiento tiene mayor demanda este mes?', 'Notebook Dell: 3 reservas. Simulador Alta Fidelidad: 2 reservas.', '2026-10-09 10:00:00', NOW(), NOW());

-- ============================================================
-- 8. QUERIES DE PRUEBA PARA SPRINT 3
-- Descomentá la que quieras probar
-- ============================================================

-- OCUPACIÓN DE ESPACIOS (% del mes)
-- SELECT e.nombre, COUNT(re.id) AS cantidad_reservas,
--        SUM(EXTRACT(EPOCH FROM (re.hora_fin - re.hora_inicio))/3600) AS horas_reservadas
-- FROM espacios e
-- LEFT JOIN reserva_espacio re ON re.espacio_id = e.id AND re.estado = 'confirmada'
-- GROUP BY e.id, e.nombre
-- ORDER BY horas_reservadas DESC;

-- EQUIPAMIENTO CON MAYOR DEMANDA
-- SELECT eq.nombre, eq.categoria, SUM(req.cantidad) AS total_unidades_reservadas, COUNT(req.id) AS veces_reservado
-- FROM equipamiento eq
-- LEFT JOIN reserva_equipamiento req ON req.equipamiento_id = eq.id AND req.estado = 'confirmada'
-- GROUP BY eq.id, eq.nombre, eq.categoria
-- ORDER BY veces_reservado DESC;

-- ACTIVIDADES POR ESTADO
-- SELECT estado, COUNT(*) AS cantidad
-- FROM actividades
-- GROUP BY estado;

-- CONFLICTOS PENDIENTES
-- SELECT tipo, descripcion, fecha_detectado
-- FROM conflicto
-- WHERE resuelto = FALSE
-- ORDER BY fecha_detectado DESC;

-- ALERTAS ACTIVAS
-- SELECT tipo, mensaje, fecha
-- FROM alerta
-- WHERE estado = 'activa'
-- ORDER BY fecha DESC;

-- ACTIVIDADES SIN ESPACIO ASIGNADO
-- SELECT a.id, a.nombre, a.fecha, a.hora_inicio, a.participantes_estimados
-- FROM actividades a
-- LEFT JOIN reserva_espacio re ON re.actividad_id = a.id AND re.estado = 'confirmada'
-- WHERE re.id IS NULL AND a.estado = 'programada';
