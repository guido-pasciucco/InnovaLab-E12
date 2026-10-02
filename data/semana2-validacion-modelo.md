# Validación del Modelo de Datos — Semana 2
**Equipo:** BI, Data & IA  
**Sprint:** Sprint 1 | Exploración  
**Referencia:** Diagrama ER v1/10 (borrador) — diagrama-er-centro-simulacion.md  

---

## Objetivo

Verificar que el modelo de datos diseñado por el equipo de backend permita construir los indicadores, dashboards y consultas inteligentes definidos para el MVP.

---

## 1. Indicadores del MVP y su soporte en el modelo actual

| Indicador | Tabla(s) necesaria(s) | Campos clave requeridos | ¿Soportado? | Observaciones |
|---|---|---|---|---|
| Ocupación de espacios | `RESERVA_ESPACIO`, `ESPACIOS` | `hora_inicio`, `hora_fin`, `espacio_id`, `estado` | ✅ | OK |
| Espacios más y menos utilizados | `RESERVA_ESPACIO`, `ESPACIOS` | `espacio_id`, `hora_inicio`, `hora_fin` | ✅ | OK |
| Cantidad de actividades programadas | `ACTIVIDADES` | `estado`, `fecha` | ✅ | OK |
| Utilización del equipamiento | `RESERVA_EQUIPAMIENTO`, `EQUIPAMIENTO` | `equipamiento_id`, `cantidad`, `hora_inicio`, `hora_fin` | ✅ | OK |
| Recursos con mayor demanda | `RESERVA_EQUIPAMIENTO`, `EQUIPAMIENTO` | `equipamiento_id`, `cantidad` | ✅ | OK |
| Recursos disponibles | `EQUIPAMIENTO` | `estado`, `cantidad` | ✅ | OK |
| Equipamiento fuera de servicio | `EQUIPAMIENTO`, `EQUIPO_HISTORIAL` | `estado`, `fecha_inicio`, `fecha_fin` | ✅ | OK |
| Reservas activas | `RESERVA_ESPACIO`, `RESERVA_EQUIPAMIENTO` | `estado`, `hora_inicio`, `hora_fin` | ✅ | OK |
| Conflictos detectados | `CONFLICTO` | `tipo`, `fecha_detectado`, `resuelto` | ✅ | OK |
| Actividades con recursos o espacios pendientes | `ACTIVIDADES`, `RESERVA_ESPACIO`, `RESERVA_EQUIPAMIENTO` | `actividad_id`, `estado` | ✅ | OK |
| Historial de utilización por espacio | `ESPACIO_HISTORIAL` | `espacio_id`, `estado`, `fecha_inicio`, `fecha_fin` | ✅ | OK |
| Historial de utilización por equipamiento | `EQUIPO_HISTORIAL` | `equipamiento_id`, `estado`, `fecha_inicio`, `fecha_fin` | ✅ | OK |
| Consultas de IA con historial | `CONSULTA_IA` | `usuario_id`, `pregunta`, `respuesta`, `fecha` | ✅ | OK |

---

## 2. Problemas detectados y campos faltantes

### 2.1 Falta `created_at` / `updated_at` en todas las tablas

**Tablas afectadas:** `ACTIVIDADES`, `RESERVA_ESPACIO`, `RESERVA_EQUIPAMIENTO`, `ESPACIOS`, `EQUIPAMIENTO`, `USUARIOS`, `CONFLICTO`, `ALERTA`

**Impacto:** Sin estos campos no es posible:
- Saber cuándo se creó una reserva (distinto a cuándo ocurre)
- Auditar cambios de estado
- Analizar patrones de carga del sistema por período
- Detectar tendencias de uso a lo largo del tiempo

**Propuesta:** Agregar `created_at DATETIME` y `updated_at DATETIME` como campos estándar en todas las tablas principales.

---

### 2.2 No hay trazabilidad de ubicación actual del equipamiento trasladable

**Tabla afectada:** `EQUIPAMIENTO`

**Situación actual:** Existe `espacio_habitual_id` (dónde suele estar) pero no hay campo para registrar dónde está el equipamiento en este momento cuando fue movido para una actividad.

**Impacto:** No se puede responder a preguntas como:
- "¿Dónde están las notebooks ahora mismo?"
- "¿Qué equipamiento trasladable está fuera de su espacio habitual?"

**Propuesta:** Agregar campo `ubicacion_actual_id FK → ESPACIOS` a la tabla `EQUIPAMIENTO`, que se actualice cuando se confirma una reserva de equipamiento trasladable.

---

### 2.3 `ALERTA` usa referencias genéricas en lugar de FK tipadas

**Tabla afectada:** `ALERTA`

**Situación actual:** Usa `referencia_tipo VARCHAR` + `referencia_id INT` para apuntar a cualquier entidad (patrón polymorphic).

**Impacto:** Complica las consultas analíticas porque no se puede hacer JOIN directo. Para los dashboards habría que filtrar por `referencia_tipo` antes de cada consulta.

**Propuesta:** Evaluar si conviene mantener el patrón polimórfico (más flexible) o agregar FK opcionales explícitas (`espacio_id`, `equipamiento_id`, `actividad_id`) según el tipo de alerta. Para el MVP, el patrón actual es aceptable siempre que se documente bien qué valores puede tomar `referencia_tipo`.

---

### 2.4 `ACTIVIDADES` no registra duración calculada

**Tabla afectada:** `ACTIVIDADES`

**Situación actual:** Tiene `hora_inicio` y `hora_fin` como tipo `TIME`, pero no hay campo de duración precalculada.

**Impacto:** Menor. La duración se puede calcular en las consultas, pero para indicadores de ocupación acumulada es más eficiente tenerla almacenada.

**Propuesta:** Opcional para el MVP. Se puede calcular en capa de BI sin modificar el modelo.

---

## 3. Validación de soporte para análisis de datos (Sprint 3-4)

Los siguientes análisis están previstos para semanas posteriores. Se valida si el modelo actual los soporta:

| Análisis | ¿Soportado con el modelo actual? | Requiere |
|---|---|---|
| Horarios de mayor demanda | ⚠️ Parcial | Agregar `created_at` a reservas |
| Espacios subutilizados | ✅ | `RESERVA_ESPACIO` + `ESPACIOS` |
| Recursos con mayor frecuencia de uso | ✅ | `RESERVA_EQUIPAMIENTO` |
| Equipamiento crítico (alta demanda, fuera de servicio frecuente) | ✅ | `RESERVA_EQUIPAMIENTO` + `EQUIPO_HISTORIAL` |
| Tendencias de ocupación por período | ⚠️ Parcial | Agregar `created_at` a reservas y actividades |
| Concentración de actividades por período | ✅ | `ACTIVIDADES.fecha` |
| Patrones relevantes para planificación | ⚠️ Parcial | Agregar `created_at` en tablas clave |

---

## 4. Soporte para consulta inteligente mediante IA

La tabla `CONSULTA_IA` ya existe y tiene la estructura necesaria. Para que la IA funcione correctamente sobre datos reales, el sistema necesita exponer endpoints que respondan preguntas como:

- *"¿Qué laboratorios están disponibles mañana por la tarde?"* → requiere `ESPACIOS` + `RESERVA_ESPACIO`
- *"¿Qué recursos tuvieron mayor utilización este mes?"* → requiere `RESERVA_EQUIPAMIENTO` + `created_at`
- *"¿Qué actividades tienen equipamiento pendiente?"* → requiere `ACTIVIDADES` + `RESERVA_EQUIPAMIENTO`
- *"¿Qué espacio tuvo menor ocupación durante agosto?"* → requiere `RESERVA_ESPACIO` + filtro por mes

Todas estas consultas son posibles con el modelo actual, con la salvedad del punto 2.1 (necesidad de `created_at` para filtros temporales precisos).

---

## 5. Resumen de cambios propuestos al modelo

| Prioridad | Cambio | Tabla(s) | Impacto si no se hace |
|---|---|---|---|
| 🔴 Alta | Agregar `created_at` y `updated_at` | Todas las tablas principales | No se pueden analizar tendencias ni auditar cambios |
| 🟡 Media | Agregar `ubicacion_actual_id` | `EQUIPAMIENTO` | No hay trazabilidad de equipamiento trasladable |
| 🟢 Baja | Documentar valores de `referencia_tipo` | `ALERTA` | Las consultas analíticas sobre alertas son más complejas |
| 🟢 Baja | Campo `duracion_minutos` precalculado | `ACTIVIDADES` | Se puede calcular en BI, no bloquea el MVP |

---

## 6. Conclusión

El modelo de datos cubre correctamente los indicadores principales del MVP. Con los ajustes de **prioridad alta** (campos `created_at` / `updated_at`) y **prioridad media** (ubicación actual de equipamiento), el modelo quedará preparado para soportar todos los análisis previstos hasta el Sprint 4 inclusive.

Se recomienda comunicar estos cambios al equipo de backend antes de que avancen con la implementación de las migraciones.

---

*Elaborado por: Equipo BI, Data & IA — Semana 2*  
*Basado en: diagrama-er-centro-simulacion.md (Rebeca)*
