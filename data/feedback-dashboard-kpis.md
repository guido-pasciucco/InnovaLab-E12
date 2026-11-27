# Feedback Dashboard KPIs
**Equipo:** BI, Data & IA
**Referencia:** Revisión de queries y visualización del dashboard en producción

---

## Estado de resolución

| Problema | Estado |
|---|---|
| Fecha hardcodeada KPI 2 | ✅ Resuelto por backend |
| Actividades por estado | ✅ Implementado por backend |
| Tiempo promedio resolución conflictos | ✅ Implementado por backend |
| Nombre espacio en agenda diaria (KPI 5) | ✅ Implementado por backend |
| Etiquetas snake_case en UI | 🔄 En progreso (Franco y Andrea) |
| Etiqueta variaciones semanales | 🔄 En progreso (Franco y Andrea) |

---

## 1. Problemas en las queries

### ✅ Fecha hardcodeada en KPI de ocupación de espacios — RESUELTO
La query del KPI 2 (ocupación por espacio) tiene la fecha fija para octubre 2026. A partir de noviembre muestra 0% en todos los espacios.

**Query actual:**
```sql
AND re.hora_inicio >= '2026-10-01 00:00:00' 
AND re.hora_fin <= '2026-10-31 23:59:59'
```

**Fix propuesto:**
```sql
AND DATE_TRUNC('month', re.hora_inicio) = DATE_TRUNC('month', CURRENT_DATE)
```

### ✅ KPIs de ocupación y utilización en 0% — RESUELTO
Consecuencia directa del fix de fecha. Ya muestra valores reales del mes en curso.

### 🟡 Actividades programadas en 0
El KPI filtra por `CURRENT_DATE`. Si no hay actividades cargadas para el día de hoy en la base devuelve 0. Verificar si hay datos cargados o si la query debería mostrar actividades futuras también.

### 🟡 Recursos con mayor demanda todos en 0 reservas
Las queries de demanda filtran por período y si no hay reservas en el mes actual devuelven 0. Mismo origen que el problema de fecha.

---

## 2. Problemas visuales

### Nombres de KPIs en formato técnico
Los nombres se muestran en snake_case directamente desde la query (`ocupacion_espacios_pct`, `utilización_diff_semana_anterior`). Habría que renombrarlos a etiquetas legibles en la UI.

### Número negativo en "diff semana anterior"
`utilización_diff_semana_anterior: -3` es correcto en datos (3 reservas menos que la semana pasada) pero confunde sin contexto. Sugerencia: mostrarlo como "▼ 3 menos que la semana pasada" con color rojo/verde según suba o baje.

### Nombres de espacios en minúscula
Los espacios aparecen en minúscula (`sala de capacitación virtual`, `laboratorio de autoelevadores y logística`) por el mutador que normaliza a minúsculas en el modelo. Habría que capitalizar la primera letra en el frontend.

---

## 3. Indicadores agregados — IMPLEMENTADOS ✅

### ✅ Actividades por estado (global)
```sql
SELECT estado, COUNT(*) AS cantidad
FROM actividades
GROUP BY estado;
```

### ✅ Tiempo promedio de resolución de conflictos — IMPLEMENTADO
```sql
SELECT 
    ROUND(AVG(EXTRACT(EPOCH FROM (fecha_resolucion - fecha_detectado))/3600), 1) AS promedio_horas_resolucion
FROM conflicto
WHERE resuelto = TRUE AND fecha_resolucion IS NOT NULL;
```

### ✅ Nombre de espacio en agenda diaria — IMPLEMENTADO
En el KPI 5 (agenda diaria), cuando una actividad tiene espacio asignado mostrar también el nombre:
```sql
e.nombre AS espacio_asignado
```
Con un JOIN adicional a `espacios`.

---

*Equipo BI, Data & IA — InnovaLab*
