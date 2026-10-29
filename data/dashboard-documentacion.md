# Dashboard de Gestión — InnovaLab Centro de Simulación
**Equipo:** BI, Data & IA  
**Herramienta:** Power BI Desktop  
**Fuente de datos:** PostgreSQL en Render (`innovalab`)

---

## Conexión a la base de datos

- **Host:** `dpg-dbdm817b9u1s73a68lp0-a.oregon-postgres.render.com`
- **Base de datos:** `innovalab`
- **Puerto:** `5432`
- **Usuario:** `innovalab_user`
- **SSL:** Requerido
- **Modo de conectividad:** Importar

### Tablas cargadas
- `public.actividades`
- `public.alerta`
- `public.conflicto`
- `public.consulta_ia`
- `public.equipamiento`
- `public.equipamiento_reserva`
- `public.equipo_historial`
- `public.espacio_historial`
- `public.espacios`
- `public.reserva_equipamiento`
- `public.reserva_espacio`
- `public.reservas`
- `public.roles`
- `public.usuarios`

---

## Modelo de relaciones

Todas las relaciones son **Uno a Muchos (1:*)** con dirección de filtro cruzado **Único**.

| Tabla "uno" | Campo | Tabla "muchos" | Campo |
|---|---|---|---|
| `public espacios` | `id` | `public reserva_espacio` | `espacio_id` |
| `public espacios` | `id` | `public espacio_historial` | `espacio_id` |
| `public espacios` | `id` | `public equipamiento` | `espacio_habitual_id` |
| `public actividades` | `id` | `public reserva_espacio` | `actividad_id` |
| `public actividades` | `id` | `public reserva_equipamiento` | `actividad_id` |
| `public actividades` | `id` | `public reservas` | `actividad_id` |
| `public equipamiento` | `id` | `public reserva_equipamiento` | `equipamiento_id` |
| `public equipamiento` | `id` | `public equipo_historial` | `equipamiento_id` |
| `public usuarios` | `id` | `public actividades` | `responsable_id` |
| `public usuarios` | `id` | `public consulta_ia` | `usuario_id` |
| `public roles` | `id` | `public usuarios` | `rol_id` |

---

## Medidas DAX creadas

### Página Resumen

```dax
Actividades Programadas = 
CALCULATE(
    COUNTROWS('public actividades'),
    'public actividades'[estado] = "programada"
)
```

```dax
Espacios Disponibles = 
CALCULATE(
    COUNTROWS('public espacios'),
    'public espacios'[estado] = "disponible"
)
```

```dax
Equipamiento Fuera de Servicio = 
CALCULATE(
    COUNTROWS('public equipamiento'),
    'public equipamiento'[estado] = "fuera_de_servicio"
)
```

```dax
Alertas Activas = 
CALCULATE(
    COUNTROWS('public alerta'),
    'public alerta'[estado] = "activa"
)
```

### Página Espacios y Equipamiento

```dax
Horas Ocupadas = 
SUMX(
    'public reserva_espacio',
    DATEDIFF(
        'public reserva_espacio'[hora_inicio],
        'public reserva_espacio'[hora_fin],
        HOUR
    )
)
```

### Página Conflictos y Alertas

```dax
Conflictos Pendientes = 
CALCULATE(
    COUNTROWS('public conflicto'),
    'public conflicto'[resuelto] = FALSE
)
```

```dax
Actividades Sin Espacio = 
COUNTROWS(
    FILTER(
        'public actividades',
        'public actividades'[estado] = "programada" &&
        CALCULATE(COUNTROWS('public reserva_espacio')) = 0
    )
)
```

---

## Estructura del dashboard

### Página 1 — Resumen
- 4 tarjetas KPI: Actividades Programadas, Espacios Disponibles, Equipamiento Fuera de Servicio, Alertas Activas
- Gráfico de anillos: actividades por estado
- Tabla: alertas activas (tipo, mensaje, fecha, estado)

### Página 2 — Espacios y Equipamiento
- Gráfico de barras horizontales: reservas por espacio (de mayor a menor)
- Gráfico de barras apiladas: espacios por tipo y estado
- Gráfico de barras apiladas: equipamiento por categoría y estado
- Tabla: espacios con horas ocupadas (nombre, tipo, capacidad, estado, horas)

### Página 3 — Conflictos y Alertas
- Tarjeta: conflictos pendientes
- Tarjeta: actividades sin espacio asignado
- Gráfico de anillos: conflictos por tipo
- Tabla: detalle de conflictos pendientes (tipo, descripción, fecha, resuelto)
- Gráfico de barras: alertas por tipo y estado

---

*Archivo: `innovalab-dashboard-sprint3.pbix`*  
*Equipo BI, Data & IA — InnovaLab*
