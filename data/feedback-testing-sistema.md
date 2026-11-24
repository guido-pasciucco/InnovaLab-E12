# Feedback Testing del Sistema
**Equipo:** BI, Data & IA
**Tipo:** Pruebas funcionales sobre el sistema en producción
**URL testeada:** https://innovalab-e12-x1o3.onrender.com

---

## Módulo de IA

### 🔴 Respuestas estáticas
Las respuestas del chat de IA parecen ser fijas y no personalizadas según lo que se consulta. No parece estar usando los datos reales de la base en tiempo real para generar respuestas contextuales.

**Esperado:** respuesta dinámica basada en los datos actuales del sistema.
**Encontrado:** respuestas que no varían según la consulta o no reflejan los datos reales.

---

## Módulo de Espacios

### 🟡 Filtro sin opción de resetear
Al seleccionar un estado en el filtro no hay forma de volver a ver todos los espacios sin cambiar manualmente la selección. Falta un botón "Ver todos" o "Limpiar filtro".

### 🔴 Espacios duplicados
Se visualizan espacios repetidos en el listado. Puede ser un problema en el seeder que cargó registros duplicados o una falla en la query de listado.

### 🟡 Campos "Tipo" y "Ubicación" como texto libre
Al agregar un espacio, los campos Tipo y Ubicación son texto libre. Esto genera registros con distintas formas de nombrar lo mismo (ej: "Lab A" vs "laboratorio a"). Sugerencia: convertirlos en desplegables con opciones predefinidas para mantener consistencia en los datos.

---

## Módulo de Equipamiento

### 🔴 Filtro de movilidad no funciona correctamente
El filtro aparece con "Fijo" seleccionado por defecto pero muestra tanto fijos como trasladables. Al seleccionar "Fijo" no filtra. Solo funciona si primero se selecciona "Movible" y después se vuelve a "Fijo". Es un bug de estado inicial del componente.

### 🟡 Campos "Categoría" y "Tipo" como texto libre
Igual que en espacios, estos campos deberían ser desplegables con opciones predefinidas para evitar inconsistencias en los nombres al cargar datos.

---

## Módulo de Actividades

### 🔴 No se encontró cómo agregar nuevas actividades
No hay botón ni acceso visible para crear una actividad nueva desde la interfaz. Si existe, no es evidente para el usuario.

**Pregunta para el equipo:** ¿está implementado el alta de actividades? ¿Desde qué pantalla se hace?

---

## Módulo de Alertas

### 🔴 No se encontró cómo crear o configurar alertas
No hay forma visible de generar alertas manualmente ni de configurar cuándo se disparan automáticamente.

**Pregunta para el equipo:** ¿las alertas se generan solo automáticamente desde el backend (por conflictos, equipamiento fuera de servicio, etc.) o también debería haber una forma manual de crearlas desde la UI?

---

## Resumen de prioridades

| Módulo | Problema | Prioridad |
|---|---|---|
| IA | Respuestas estáticas | 🔴 Alta |
| Espacios | Registros duplicados | 🔴 Alta |
| Equipamiento | Filtro de movilidad roto | 🔴 Alta |
| Actividades | No se puede crear desde la UI | 🔴 Alta |
| Alertas | No hay forma de crearlas/configurarlas | 🔴 Alta |
| Espacios | Sin botón para resetear filtro | 🟡 Media |
| Espacios | Tipo y Ubicación como texto libre | 🟡 Media |
| Equipamiento | Categoría y Tipo como texto libre | 🟡 Media |

---

*Equipo BI, Data & IA — InnovaLab*
