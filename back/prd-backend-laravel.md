# Documento de Requisitos de Producto (PRD) — Backend Laravel
## Sistema de Gestión Institucional Inteligente para el Centro de Simulación (InnovaLab)

**Versión:** 1.0  
**Estado:** Borrador para Desarrollo  
**Tecnología Principal:** Laravel 10/11 (PHP 8.2+)  
**Proyecto:** InnovaLab — Centro de Simulación  

---

### **1. Visión General, Problemática y Alcance del MVP**

#### **1.1 Contexto e Identificación del Producto**
El Centro de Simulación (InnovaLab) es un espacio innovador orientado a articular la formación técnica, la docencia y el sector productivo mediante actividades formativas, prácticas y talleres. Actualmente, la operación diaria involucra la coordinación constante de diversos espacios (aulas, laboratorios, talleres), equipamiento tecnológico y recursos humanos.

#### **1.2 Problemática Operativa**
La administración actual del Centro depende de herramientas dispersas, registros en planillas, cuadernos y mensajería informal. Esta fragmentación genera:
* **Falta de visibilidad en tiempo real:** Dificultad para conocer qué espacios o equipos están realmente libres.
* **Solapamientos y conflictos:** Detección tardía de choques de agenda entre actividades.
* **Ineficiencia de recursos:** Equipamientos sobrecargados o subutilizados.
* **Incertidumbre en la gestión:** Ausencia de una base de datos centralizada e histórica para generar reportes e indicadores estratégicos a la dirección.

#### **1.3 Solución Propuesta**
Desarrollar una API REST centralizada y segura construida en **Laravel** que sirva como motor operativo de la plataforma web institucional. El backend organizará, relacionará y validará automáticamente todas las entidades operativas (espacios, equipamiento, actividades y reservas), exponiendo además endpoints para visualizaciones de dashboard y consultas en lenguaje natural mediante IA.

#### **1.4 Alcance del MVP (Roles y Flujos)**
Para el Producto Mínimo Viable (MVP), el backend dará soporte a dos roles de usuario principales:
1. **Administrador:**
   * Configuración completa de datos maestros (espacios, recursos y actividades).
   * Gestión de usuarios y asignación de permisos.
   * Definición de reglas operativas y acceso completo a métricas e indicadores.
2. **Gestión / Coordinación:**
   * Operación cotidiana: alta/edición de actividades, consulta de disponibilidad y registro de reservas.
   * Asignación de recursos fijos y trasladables a actividades.
   * Registro de incidencias (marcación de mantenimiento / fuera de servicio) y consulta de alertas.

*(Nota: El rol **Instructor/Docente** y el seguimiento individual de trayectorias de estudiantes quedan diferidos para la etapa Post-MVP).*

---

### **2. Arquitectura Técnica y Stack Tecnológico Backend**

| Componente | Tecnología / Paquete | Descripción y Función |
| :--- | :--- | :--- |
| **Framework Base** | Laravel 10/11 (PHP 8.2+) | Arquitectura orientada a API REST con respuestas JSON estandarizadas. |
| **Autenticación API** | Laravel Sanctum | Emisión de tokens de acceso seguros (Bearer Tokens) para usuarios autenticados. |
| **Autorización y Permisos** | Spatie Laravel-Permission | Control de acceso basado en roles (**RBAC**). |
| **Base de Datos Relacional**| PostgreSQL / MySQL | Motor de base de datos relacional con integridad referencial estricta. |
| **Carga e Importación Masiva**| `maatwebsite/excel` | Procesamiento e importación inicial de datos maestros desde archivos CSV/Excel. |
| **Arquitectura Interna** | Service Layer & Form Requests | Encapsulamiento de la lógica de negocio en clases `Service` dedicadas y validación estricta de payloads. |

---

### **3. Modelo de Datos y Entidades Principales (Eloquent Models)**

#### **3.1 Diagrama Entidad-Relación (Estructura Relacional)**

* `User` **1 — N** `Activity` *(un usuario de Gestión coordina múltiples actividades)*
* `Space` **1 — N** `Equipment` *(equipamiento asignado habitualmente a un espacio)*
* `Activity` **1 — 1** `Reservation` *(una actividad confirmada posee un registro de reserva)*
* `Reservation` **N — 1** `Space` *(múltiples reservas ocurren en un mismo espacio a lo largo del tiempo)*
* `Activity` **N — M** `Equipment` *(vía tabla pivote `activity_equipment` para asociar equipos específicos)*

#### **3.2 Especificación de Tablas y Atributos**

##### **1. Tabla `users`**
* `id` (BigIncrements, PK)
* `name` (String)
* `email` (String, Unique)
* `password` (String, Hashed)
* `status` (Enum: `active`, `inactive`) — *Default: `active`*
* `timestamps`

##### **2. Tabla `spaces`**
* `id` (BigIncrements, PK)
* `name` (String) — *ej. "Laboratorio de Simulación A", "Aula 201"*
* `type` (Enum: `aula`, `laboratorio`, `taller`, `otro`)
* `location` (String) — *ej. "Piso 2 - Edificio Principal"*
* `capacity` (Integer) — *capacidad máxima de personas*
* `features` (JSON, Nullable) — *ej. `{"aire_acondicionado": true, "proyector": true}`*
* `status` (Enum: `disponible`, `mantenimiento`, `fuera_de_servicio`) — *Default: `disponible`*
* `timestamps`

##### **3. Tabla `equipment`**
* `id` (BigIncrements, PK)
* `name` (String) — *ej. "Simulador de Alta Fidelidad", "Notebook Dell"*
* `category` (String) — *ej. "Informática", "Médico", "Audiovisual"*
* `type` (Enum: `fijo`, `trasladable`) — *diferencia crítica para la asignación de recursos*
* `default_space_id` (BigInteger, FK `spaces.id`, Nullable) — *espacio base si es fijo*
* `current_location` (String, Nullable) — *ubicación física actual*
* `status` (Enum: `disponible`, `mantenimiento`, `fuera_de_servicio`) — *Default: `disponible`*
* `timestamps`

##### **4. Tabla `activities`**
* `id` (BigIncrements, PK)
* `title` (String) — *nombre de la actividad o curso*
* `type` (Enum: `curso`, `practica`, `workshop`, `capacitacion`, `otro`)
* `responsible_id` (BigInteger, FK `users.id`) — *coordinador o docente a cargo*
* `date` (Date)
* `start_time` (Time)
* `end_time` (Time)
* `estimated_participants` (Integer) — *cantidad prevista de asistentes*
* `status` (Enum: `programada`, `en_curso`, `finalizada`, `cancelada`) — *Default: `programada`*
* `timestamps`

##### **5. Tabla `reservations`**
* `id` (BigIncrements, PK)
* `activity_id` (BigInteger, FK `activities.id`, Unique)
* `space_id` (BigInteger, FK `spaces.id`)
* `start_datetime` (DateTime)
* `end_datetime` (DateTime)
* `status` (Enum: `confirmed`, `cancelled`) — *Default: `confirmed`*
* `timestamps`

##### **6. Tabla Pivote `activity_equipment`**
* `id` (BigIncrements, PK)
* `activity_id` (BigInteger, FK `activities.id`)
* `equipment_id` (BigInteger, FK `equipment.id`)
* `quantity` (Integer) — *Default: 1*
* `is_extra_transferable` (Boolean) — *indica si fue incorporado como refuerzo trasladable*

---

### **4. Especificación de Endpoints REST API y Lógica de Negocio**

#### **4.1 Autenticación y Perfil (`/api/v1/auth`)**
* `POST /api/v1/auth/login`
  * **Payload:** `{"email": "admin@innovalab.edu.ar", "password": "..."}`
  * **Respuesta:** Token Sanctum (`bearer_token`) y objeto `user` con sus roles.
* `POST /api/v1/auth/logout`
  * Revoca el token de sesión activo.
* `GET /api/v1/auth/me`
  * Devuelve la información del usuario autenticado y su mapa de permisos Spatie.

#### **4.2 Gestión de Espacios y Equipamiento (`/api/v1/spaces` & `/api/v1/equipment`)**
* `GET /api/v1/spaces`
  * **Query Params:** `type`, `min_capacity`, `status`, `date`, `start_time`, `end_time`.
  * Devuelve la lista de espacios aplicando filtros de disponibilidad temporal.
* `POST /api/v1/spaces` *(Middleware: Role Admin)*
  * Crea un nuevo espacio en el sistema.
* `PUT /api/v1/spaces/{id}/status`
  * Modifica el estado del espacio (p. ej., bloqueo por mantenimiento).
* `GET /api/v1/equipment`
  * **Query Params:** `type` (`fijo`/`trasladable`), `category`, `status`, `space_id`.
* `PUT /api/v1/equipment/{id}/location`
  * Actualiza la ubicación física actual del equipo cuando es trasladado.
* `POST /api/v1/imports/master-data` *(Middleware: Role Admin)*
  * Carga e importación masiva de espacios y equipos desde CSV/Excel usando Laravel Excel.

#### **4.3 Motor de Reservas y Validaciones (`/api/v1/activities` & `/api/v1/reservations`)**
* `POST /api/v1/activities`
  * Registra una nueva actividad solicitando espacio y requerimientos de equipamiento.
* **Servicio Crítico Backend: `ReservationValidationService`**
  Antes de confirmar una reserva, este servicio ejecuta dentro de una transacción `DB::transaction()` las siguientes validaciones:
  1. **Solapamiento Horario de Espacio:** Comprueba que no existan reservas activas en el rango `[start_datetime, end_datetime]` para el `space_id` seleccionado.
  2. **Capacidad del Espacio:** Verifica que `space.capacity >= activity.estimated_participants`.
  3. **Estado del Espacio y Equipos:** Excluye automáticamente cualquier espacio o recurso en estado `mantenimiento` o `fuera_de_servicio`.
  4. **Diferenciación de Equipamiento (Fijo vs. Trasladable):**
     * Identifica los equipos fijos preexistentes en el espacio.
     * Si la demanda de la actividad supera lo disponible en el espacio, busca equipos de tipo `trasladable` en estado `disponible` que no estén comprometidos en otro espacio durante dicho horario.
     * Si faltan recursos trasladables o existe solapamiento, rechaza la transacción e informa detalladamente los faltantes.
* `GET /api/v1/calendar`
  * **Query Params:** `view` (`daily`, `weekly`, `monthly`), `start_date`, `space_id`.
  * Retorna el conjunto estructurado de actividades y reservas para alimentar calendarios (p. ej., FullCalendar).

#### **4.4 Dashboard, Métricas e Indicadores (`/api/v1/dashboard`)**
* `GET /api/v1/dashboard/metrics`
  * Retorna los KPIs principales del sistema:
    * Tasa de ocupación porcentual por espacio.
    * Conteo de equipamiento fuera de servicio / en mantenimiento.
    * Ranking de recursos y espacios más demandados.
    * Cantidad de reservas activas y actividades programadas.
* `GET /api/v1/dashboard/alerts`
  * Expone alertas operativas en tiempo real (conflictos detectados, actividades con recursos faltantes, mantenimiento vencido).

#### **4.5 Capa de Integración para Consulta Inteligente / IA (`/api/v1/ai`)**
* `GET /api/v1/ai/context-query`
  * Endpoint especializado que atiende las solicitudes del módulo de IA conversacional. Recibe parámetros de búsqueda derivados del lenguaje natural (ej. disponibilidades para mañana, tasa de uso mensual) y ejecuta las consultas sobre la base de datos real en tiempo récord, asegurando respuestas grounded y sin alucinaciones.

---

### **5. Requisitos No Funcionales, Seguridad y Auditoría**

1. **Prevención Anti-Double Booking:**
   * Utilización de transacciones SQL (`DB::transaction()`) y bloqueos pesimistas (`lockForUpdate()`) durante la verificación y creación de reservas para prevenir condiciones de carrera cuando dos coordinadores intentan reservar el mismo espacio de forma simultánea.
2. **Validación de Payloads y Sanitización:**
   * Implementación de *Form Request Classes* de Laravel para cada endpoint de creación/edición, asegurando tipado, sanitización e integridad antes de tocar la capa de controladores.
3. **Manejo Estandarizado de Respuestas y Errores:**
   * Estructura JSON unificada:
     ```json
     {
       "success": false,
       "message": "Conflicto de disponibilidad detectado",
       "errors": {
         "space": ["El laboratorio seleccionado ya posee una reserva confirmada en ese horario."],
         "equipment": ["Se requieren 5 notebooks trasladables adicionales pero solo hay 2 disponibles."]
       }
     }
     ```
4. **Trazabilidad y Registro de Incidencias:**
   * Registro histórico de cambios de estado en equipamientos y movimientos de ubicación para auditoría interna.

---

### **6. Plan de Trabajo Backend por Sprints (12 Semanas)**

#### **Sprint 0: Preparación y Entorno (Semana 0)**
* Configuración del proyecto Laravel 10/11, repositorio Git y entorno de base de datos.
* Definición conceptual final de migraciones y modelos Eloquent.

#### **Sprint 1: Autenticación, Roles y Base de Datos (Semanas 1–2)**
* Ejecución de migraciones de tablas base (`users`, `spaces`, `equipment`).
* Configuración de Laravel Sanctum y Spatie Permissions (Roles `Administrador` y `Gestión/Coordinación`).
* Implementación de CRUD inicial para espacios y equipamiento básico.

#### **Sprint 2: Gestión Completa de Recursos y Actividades (Semanas 3–4)**
* Desarrollo de la lógica para equipamiento fijo y trasladable (`default_space_id`, `current_location`).
* Endpoints para la creación, edición y cancelación de actividades.
* Módulo de carga masiva de datos iniciales mediante Laravel Excel (`/api/v1/imports/master-data`).

#### **Sprint 3: Motor de Reservas y Validaciones de Conflictos (Semanas 5–6)**
* Desarrollo del servicio central `ReservationValidationService` (solapamiento horario, capacidad y recursos trasladables).
* Endpoints del calendario operativo (`/api/v1/calendar`).
* Endpoints para el Dashboard de métricas e indicadores iniciales (`/api/v1/dashboard/metrics`).

#### **Sprint 4: Capa para IA e Integración End-to-End (Semanas 7–8)**
* Desarrollo del endpoint `/api/v1/ai/context-query` para alimentar la interfaz de IA conversacional con datos reales.
* Integración completa con el equipo de Frontend y pruebas de los flujos del MVP.

#### **Sprint 5: Testing Intensivo, Seguridad y Optimización (Semanas 9–10)**
* Ejecución de pruebas unitarias e de integración con Pest / PHPUnit sobre el motor de reservas.
* Optimización de consultas SQL (prevención de problema N+1 mediante *Eager Loading*).
* Corrección de bugs detectados por QA.

#### **Sprint 6: Cierre, Documentación y Despliegue (Semanas 11–12)**
* Documentación técnica de APIs (OpenAPI / Swagger).
* Despliegue en entorno productivo (Render / Railway / Vercel + Managed Database).
* Soporte en Demo Day del prototipo final.
