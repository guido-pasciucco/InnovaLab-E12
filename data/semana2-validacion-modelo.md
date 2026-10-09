# Validación del Modelo de Datos — Semana 2
**Equipo:** BI, Data & IA  
**Sprint:** Sprint 1 | Exploración  
**Referencias:**
- Diagrama ER v1/10 (borrador) — `diagrama-er-centro-simulacion.md` *(Rebeca)*
- PRD Backend Laravel v1.0 — `prd-backend-laravel.md` *(Equipo Backend)*

**Última actualización:** Semana 2 — revisión post migraciones reales de backend (rama `feature/backend`)

---

## Objetivo

Verificar que el modelo de datos diseñado por el equipo de backend permita construir los indicadores, dashboards y consultas inteligentes definidos para el MVP. Este documento cruza el diagrama ER de Rebeca con el PRD de backend en Laravel para identificar divergencias, riesgos y acciones concretas antes de que el backend avance con las migraciones.

---

## 1. Contexto: dos versiones del modelo

El equipo trabajó con dos documentos de referencia que **no son idénticos**. Es importante entender las diferencias:

| | ER de Rebeca | PRD de Backend (Laravel) |
|---|---|---|
| **Enfoque** | Modelo conceptual completo | Especificación técnica de implementación |
| **Tablas de historial** | `ESPACIO_HISTORIAL`, `EQUIPO_HISTORIAL` | No definidas explícitamente |
| **Reservas** | `RESERVA_ESPACIO` + `RESERVA_EQUIPAMIENTO` separadas | `reservations` (espacio) + pivote `activity_equipment` |
| **Conflictos** | Tabla `CONFLICTO` persistente | Lógica en `ReservationValidationService`, sin tabla |
| **Alertas** | Tabla `ALERTA` con historial | Endpoint `/api/v1/dashboard/alerts`, sin tabla definida |
| **Consultas IA** | Tabla `CONSULTA_IA` | No aparece definida |
| **Timestamps** | No mencionados en el ER | `timestamps` de Laravel en todas las tablas ✅ |
| **Ubicación actual equipo** | No tenía campo explícito | Campo `current_location` en `equipment` ✅ |

---

## 2. Indicadores del MVP y su soporte en el modelo de backend (Laravel)

Referencia: modelo del PRD backend — tablas `spaces`, `equipment`, `activities`, `reservations`, `activity_equipment`.

| Indicador | Tabla(s) en modelo backend | Campos clave | ¿Soportado? | Observaciones |
|---|---|---|---|---|
| Ocupación de espacios | `reservations`, `spaces` | `start_datetime`, `end_datetime`, `space_id`, `status` | ✅ | OK |
| Espacios más y menos utilizados | `reservations`, `spaces` | `space_id`, `start_datetime`, `end_datetime` | ✅ | OK |
| Cantidad de actividades programadas | `activities` | `status`, `date` | ✅ | OK |
| Utilización del equipamiento | `activity_equipment`, `equipment` | `equipment_id`, `quantity` | ✅ | Sin timestamps propios, usa `created_at` de `activity_equipment` |
| Recursos con mayor demanda | `activity_equipment`, `equipment` | `equipment_id`, `quantity` | ✅ | OK |
| Recursos disponibles | `equipment` | `status` | ✅ | OK |
| Equipamiento fuera de servicio | `equipment` | `status`, `updated_at` | ⚠️ Parcial | Sin tabla de historial, solo estado actual |
| Reservas activas | `reservations` | `status`, `start_datetime`, `end_datetime` | ✅ | OK |
| Conflictos detectados | *(sin tabla)* | — | ❌ | El `ReservationValidationService` detecta conflictos pero **no los persiste**. Sin tabla no hay historial ni dashboard de conflictos. |
| Actividades con recursos o espacios pendientes | `activities`, `reservations`, `activity_equipment` | `status` | ✅ | OK |
| Historial de utilización por espacio | *(sin tabla)* | — | ❌ | No hay `space_history`. Solo se puede inferir de `reservations`. |
| Historial de utilización por equipamiento | *(sin tabla)* | — | ❌ | No hay `equipment_history`. Solo se puede inferir de `activity_equipment`. |
| Consultas de IA con historial | *(sin tabla)* | — | ❌ | No hay tabla `ai_queries` definida en el PRD de backend. |

---

## 3. Problemas detectados por orden de prioridad

### 🔴 3.1 Faltan tablas de historial de espacios y equipamiento

**Situación:** El PRD de backend menciona "Trazabilidad y Registro de Incidencias" como requisito no funcional pero **no define tablas concretas** para ello. El ER de Rebeca sí las tenía (`ESPACIO_HISTORIAL`, `EQUIPO_HISTORIAL`).

**Impacto para Data/IA:**
- Sin historial de estados no se puede responder: *"¿Cuántas veces estuvo en mantenimiento el Lab A este año?"*
- No se pueden detectar patrones de equipamiento crítico (alta frecuencia de fuera de servicio)
- Los indicadores de tendencia histórica de ocupación serán incompletos
- Los análisis del Sprint 3 (semanas 5-6) quedan bloqueados parcialmente

**Propuesta:** Pedir al backend que agregue las tablas:
```
space_status_history: id, space_id FK, status, reason, started_at, ended_at, created_at
equipment_status_history: id, equipment_id FK, status, reason, location, started_at, ended_at, created_at
```

---

### 🔴 3.2 Los conflictos no se persisten en base de datos

**Situación:** El `ReservationValidationService` detecta conflictos en el momento de crear una reserva, pero si no la confirman simplemente retorna un error y no queda registro. No hay tabla `conflicts`.

**Impacto para Data/IA:**
- El dashboard de "conflictos detectados" no puede mostrar historial ni tendencias
- No se puede responder: *"¿Cuántos conflictos hubo esta semana?"*
- El sistema de alertas no tiene base de datos histórica

**Propuesta:** Agregar tabla:
```
conflicts: id, type, reservation_id FK nullable, space_id FK nullable, equipment_id FK nullable,
           description, detected_at, resolved, resolved_at, created_at
```

---

### 🔴 3.3 No hay tabla para historial de consultas de IA

**Situación:** El ER de Rebeca tenía `CONSULTA_IA`. El PRD de backend no la define. El endpoint `/api/v1/ai/context-query` existe pero no guarda nada.

**Impacto para Data/IA:**
- Sin historial no se puede analizar qué preguntas hacen los usuarios
- No se puede mejorar el módulo de IA con datos reales de uso
- El módulo de IA del Sprint 4 (semana 7) necesita esta tabla

**Propuesta:** Agregar tabla:
```
ai_queries: id, user_id FK, question TEXT, response TEXT, tokens_used INT nullable,
            response_time_ms INT nullable, created_at
```

---

### 🔴 3.4 No hay tabla de alertas persistentes

**Situación:** El endpoint `/api/v1/dashboard/alerts` devuelve alertas calculadas en el momento pero no hay tabla que las persista.

**Impacto para Data/IA:**
- Sin persistencia, si una alerta se resuelve no queda registro
- No se puede analizar qué tipo de alertas son más frecuentes
- El dashboard no puede mostrar "alertas de los últimos 7 días"

**Propuesta:** Agregar tabla:
```
alerts: id, type ENUM, entity_type VARCHAR, entity_id INT, message TEXT,
        status ENUM(activa, resuelta), created_at, resolved_at nullable
```

---

### 🟡 3.5 La tabla pivote `activity_equipment` no tiene timestamps de uso

**Situación:** La tabla `activity_equipment` registra qué equipamiento se usó en qué actividad, pero no tiene `start_datetime` / `end_datetime` propios (los hereda de `activities`).

**Impacto para Data/IA:**
- Calcular utilización de equipamiento requiere hacer JOIN con `activities` siempre
- Si una actividad dura 4 horas pero el equipo solo se usó 2, no hay forma de saberlo

**Propuesta:** Evaluar agregar `start_datetime`, `end_datetime` a `activity_equipment` si el proyecto lo requiere. Para el MVP no es bloqueante.

---

### 🟢 3.6 `current_location` en `equipment` es String, no FK

**Situación:** El PRD de backend define `current_location` como `String` (ej: "Laboratorio B - Piso 1") en lugar de `FK → spaces.id`.

**Impacto para Data/IA:**
- No se puede hacer JOIN directo para saber en qué espacio está el equipo ahora
- Las consultas de IA sobre ubicación actual son más complejas

**Propuesta:** Sugerir al backend agregar también `current_space_id FK → spaces` además del campo String descriptivo. Baja prioridad para el MVP.

---

## 4. Estado real de cambios — revisión de migraciones (`feature/backend`)

Se revisaron las migraciones reales commiteadas por backend en la rama `feature/backend`. El commit `5b89188` dice explícitamente "actualiza migraciones y modelos **según requerimientos de Data e IA**". Esto es lo que efectivamente implementaron:

### ✅ Cambios implementados por backend

| Cambio solicitado | Estado en migraciones reales | Detalle |
|---|---|---|
| `timestamps` en todas las tablas | ✅ Implementado | Todas las tablas tienen `$table->timestamps()` |
| `espacio_historial` | ✅ Implementado | En migración `000003` — tiene `espacio_id`, `estado`, `fecha_inicio`, `fecha_fin`, `motivo`, `timestamps` |
| `equipo_historial` | ✅ Implementado | En migración `000004` — tiene `equipamiento_id`, `estado`, `espacio_id` FK, `ubicacion_texto`, `fecha_inicio`, `fecha_fin`, `motivo`, `timestamps` |
| `current_space_id` FK en equipamiento | ✅ Implementado | Campo `espacio_actual_id` FK → `espacios` con comentario "Solicitado por Data" |
| Tabla `conflicto` persistente | ✅ Implementado | En migración `000006` — incluye `espacio_id` y `equipamiento_id` FK directas + `fecha_resolucion` con comentario "Solicitado por Data" |
| Tabla `alerta` persistente | ✅ Implementado | En migración `000006` — incluye `fecha_resolucion` con comentario "Solicitado por Data" |
| Tabla `consulta_ia` | ✅ Implementado | En migración `000006` — tiene `usuario_id`, `pregunta`, `respuesta`, `fecha`, `timestamps` |

### ⚠️ Diferencias menores a tener en cuenta

| Punto | Situación |
|---|---|
| `consulta_ia` — campos extra | No tiene `tokens_used` ni `response_time_ms` que habíamos sugerido. No es bloqueante para el MVP. |
| `alerta` — sigue usando `referencia_tipo` + `referencia_id` (patrón polimórfico) | Aceptable para el MVP. Las queries analíticas requieren filtrar por `referencia_tipo` primero. |
| `reserva_espacio` y `reserva_equipamiento` — tablas separadas | Backend mantuvo el modelo de Rebeca (no el del PRD Laravel). Esto es **mejor para Data**: tenemos timestamps propios en cada reserva. |

---

## 5. Validación de soporte para análisis de datos (Sprint 3-4)

| Análisis (previsto en Sprint 3-4) | ¿Soportado? | Depende de |
|---|---|---|
| Horarios de mayor demanda | ✅ | `reservations.start_datetime` + `activities.date` |
| Espacios subutilizados | ✅ | `reservations` + `spaces` |
| Recursos con mayor frecuencia de uso | ✅ | `activity_equipment` |
| Equipamiento crítico (historial de fuera de servicio) | ❌ | Necesita tabla `equipment_status_history` (punto 3.1) |
| Tendencias de ocupación por período | ✅ | `reservations.created_at` + `start_datetime` |
| Concentración de actividades por período | ✅ | `activities.date` |
| Patrones de uso para planificación | ⚠️ Parcial | Necesita tablas de historial para análisis completo |
| Análisis de conflictos históricos | ❌ | Necesita tabla `conflicts` (punto 3.2) |
| Análisis de uso del módulo IA | ❌ | Necesita tabla `ai_queries` (punto 3.3) |

---

## 6. Soporte para consulta inteligente mediante IA (Sprint 4)

El endpoint `/api/v1/ai/context-query` está definido en el PRD de backend. Para que la IA responda correctamente sobre datos reales, estas consultas deben funcionar:

| Pregunta de ejemplo | Endpoint / Tablas backend necesarias | ¿Disponible? |
|---|---|---|
| "¿Qué laboratorios están disponibles mañana a la tarde?" | `GET /api/v1/spaces?date=...&start_time=...` → `spaces` + `reservations` | ✅ |
| "¿Qué recursos tuvieron mayor utilización este mes?" | `activity_equipment` + `equipment` + filtro por mes | ✅ |
| "¿Qué actividades tienen equipamiento pendiente?" | `activities` + `activity_equipment` + estado | ✅ |
| "¿Qué espacio tuvo menor ocupación en agosto?" | `reservations` + `spaces` + filtro por mes | ✅ |
| "¿Cuántas veces estuvo en mantenimiento el Lab A?" | `equipment_status_history` | ❌ Necesita tabla historial |
| "¿Cuántos conflictos hubo esta semana?" | `conflicts` | ❌ Necesita tabla conflictos |

**Importante:** <cite index="1-118,1-119">La IA funcionará sobre la información registrada en el sistema. Las reglas de disponibilidad, reservas, conflictos e indicadores deberán ser resueltas por la lógica de la plataforma.</cite> Esto significa que si los datos no están en la base, la IA no puede responderlos — no puede inventar información.

---

## 7. Resumen consolidado — estado final de cambios solicitados a backend

| Prioridad | Cambio solicitado | Estado actual |
|---|---|---|
| 🔴 Alta | Tabla `espacio_historial` | ✅ Implementado en migración `000003` |
| 🔴 Alta | Tabla `equipo_historial` | ✅ Implementado en migración `000004` |
| 🔴 Alta | Tabla `conflicto` persistente con FK directas | ✅ Implementado en migración `000006` |
| 🔴 Alta | Tabla `alerta` persistente con `fecha_resolucion` | ✅ Implementado en migración `000006` |
| 🔴 Alta | Tabla `consulta_ia` | ✅ Implementado en migración `000006` |
| 🟡 Media | `espacio_actual_id` FK en equipamiento | ✅ Implementado en migración `000004` |
| 🟢 Baja | Timestamps propios en reservas de equipamiento | ✅ Implementado — `reserva_equipamiento` tiene `hora_inicio`, `hora_fin`, `timestamps` |

**Todos los cambios solicitados fueron implementados.** El modelo está listo para construir los indicadores y el módulo de IA del MVP.

---

## 8. Conclusión

El modelo de backend implementado en Laravel cubre **todos** los requerimientos del equipo de Data/IA para el MVP. Backend incorporó todas las tablas solicitadas (historial de espacios y equipamiento, conflictos persistentes, alertas y consultas IA) con sus campos de auditoría (`timestamps`, `fecha_resolucion`, FK directas).

El modelo está preparado para soportar los indicadores del Sprint 3, el módulo de análisis de datos del Sprint 3-4, y las consultas inteligentes mediante IA del Sprint 4.

**No hay bloqueos pendientes con backend para arrancar el trabajo de Data/IA.**

---

*Elaborado por: Equipo BI, Data & IA — Semana 2*  
*Basado en: diagrama-er-centro-simulacion.md (Rebeca) + prd-backend-laravel.md (Backend)*
