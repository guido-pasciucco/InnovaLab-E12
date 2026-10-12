# Documentación de Endpoints API v1 - Centro de Simulación InnovaLab

## 🔑 Autenticación & Base URL

* **Base URL:** `http://localhost:8000/api/v1` (o la IP/Host del contenedor Docker)
* **Formato:** `JSON`
* **Autenticación:** Laravel Sanctum mediante Header `Authorization: Bearer <access_token>`

---

## 🔐 1. Módulo de Autenticación (`/api/v1/auth`)

### **1.1. Login (Obtener Token)**
* **Método:** `POST`
* **URL:** `/api/v1/auth/login`
* **Headers:** `Content-Type: application/json`, `Accept: application/json`
* **Body:**
```json
{
  "email": "admin@innovalab.edu.ar",
  "password": "admin123"
}
```
* **Respuesta Exitosa (200 OK):**
```json
{
  "message": "Inicio de sesión exitoso.",
  "access_token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "token_type": "Bearer",
  "usuario": {
    "id": 1,
    "nombre": "Administrador InnovaLab",
    "email": "admin@innovalab.edu.ar",
    "activo": true,
    "rol": {
      "id": 1,
      "nombre": "Administrador"
    },
    "created_at": "2026-10-11T18:39:06+00:00"
  }
}
```

### **1.2. Usuario Autenticado**
* **Método:** `GET`
* **URL:** `/api/v1/auth/me`
* **Headers:** `Authorization: Bearer <access_token>`, `Accept: application/json`

### **1.3. Logout**
* **Método:** `POST`
* **URL:** `/api/v1/auth/logout`
* **Headers:** `Authorization: Bearer <access_token>`, `Accept: application/json`

---

## 🏛️ 2. Módulo de Espacios Físicos (`/api/v1/espacios`)

* **Headers obligatorios:** `Authorization: Bearer <access_token>`, `Accept: application/json`

### **2.1. Listar Espacios**
* **Método:** `GET`
* **URL:** `/api/v1/espacios`
* **Query Params opcionales:** `?estado=operativo`, `?tipo=Simulación`, `?search=Sala`

### **2.2. Ver Espacio por ID**
* **Método:** `GET`
* **URL:** `/api/v1/espacios/{id}`

### **2.3. Crear Espacio**
* **Método:** `POST`
* **URL:** `/api/v1/espacios`
* **Body:**
```json
{
  "nombre": "Sala de Simulación Clínica 1",
  "tipo": "Simulación",
  "capacidad": 15,
  "ubicacion": "Planta Baja - Sector A",
  "estado": "operativo"
}
```
*(Estados válidos: `operativo`, `mantenimiento`, `inactivo`)*

### **2.4. Actualizar / Eliminar Espacio**
* **`PUT /api/v1/espacios/{id}`** — Actualiza campos del espacio.
* **`DELETE /api/v1/espacios/{id}`** — Elimina el espacio.

---

## 🩺 3. Módulo de Equipamiento (`/api/v1/equipamiento`)

### **3.1. Listar Equipamiento**
* **Método:** `GET`
* **URL:** `/api/v1/equipamiento`
* **Query Params opcionales:** `?estado=disponible`, `?categoria=Simulador`, `?espacio_id=1`, `?search=HAL`

### **3.2. Crear Equipamiento**
* **Método:** `POST`
* **URL:** `/api/v1/equipamiento`
* **Body:**
```json
{
  "nombre": "Simulador de Paciente Adulto HAL S3201",
  "categoria": "Simulador de Alta Fidelidad",
  "tipo_movilidad": "fijo",
  "cantidad": 2,
  "espacio_habitual_id": 1,
  "estado": "disponible"
}
```
*(Estados válidos: `disponible`, `en_uso`, `mantenimiento`, `fuera_de_servicio`)*

### **3.3. Ver / Editar / Eliminar Equipamiento**
* **`GET /api/v1/equipamiento/{id}`**
* **`PUT /api/v1/equipamiento/{id}`**
* **`DELETE /api/v1/equipamiento/{id}`**

---

## 📋 4. Módulo de Actividades Académicas (`/api/v1/actividades`)

### **4.1. Listar Actividades**
* **Método:** `GET`
* **URL:** `/api/v1/actividades`
* **Query Params opcionales:** `?estado=planificada`, `?tipo=Taller`, `?docente_id=1`, `?search=RCP`

### **4.2. Crear Actividad**
* **Método:** `POST`
* **URL:** `/api/v1/actividades`
* **Body:**
```json
{
  "nombre": "Taller de RCP y Reanimación Avanzada",
  "descripcion": "Práctica intensiva con simuladores",
  "tipo": "Taller",
  "cantidad_alumnos": 25,
  "estado": "planificada",
  "docente_id": 1
}
```
*(Estados válidos: `planificada`, `en_curso`, `finalizada`, `cancelada`)*

---

## 📅 5. Módulo de Reservas y Detección de Conflictos (`/api/v1/reservas`)

### **5.1. Listar Reservas**
* **Método:** `GET`
* **URL:** `/api/v1/reservas`
* **Query Params opcionales:** `?espacio_id=1`, `?actividad_id=1`, `?estado=confirmada`, `?fecha=2026-10-15`

### **5.2. Crear Reserva (Validación de disponibilidad en tiempo real)**
* **Método:** `POST`
* **URL:** `/api/v1/reservas`
* **Body:**
```json
{
  "actividad_id": 1,
  "espacio_id": 1,
  "fecha_hora_inicio": "2026-10-15 10:00:00",
  "fecha_hora_fin": "2026-10-15 12:00:00",
  "estado": "confirmada",
  "equipamiento_ids": [1],
  "observaciones": "Reserva inicial aprobada"
}
```

* **Respuesta Exitosa (201 Created):**
```json
{
  "message": "Reserva creada exitosamente",
  "data": { "id": 1, "estado": "confirmada" }
}
```

* **Respuesta en caso de Conflicto (422 Unprocessable Entity):**
```json
{
  "message": "No se puede procesar la reserva debido a conflictos de horarios.",
  "errors": [
    "El espacio 'Sala de Simulación 1' ya se encuentra reservado entre 15/10/2026 10:00 y 12:00."
  ],
  "conflictos": [
    {
      "tipo": "espacio",
      "espacio_id": 1,
      "reserva_existente_id": 1,
      "descripcion": "El espacio 'Sala de Simulación 1' ya se encuentra reservado..."
    }
  ]
}
```

---

## 🚨 6. Módulo de Alertas e Incidencias (`/api/v1/alertas`)

### **6.1. Listar Alertas**
* **Método:** `GET`
* **URL:** `/api/v1/alertas`
* **Query Params opcionales:** `?estado=activa`, `?tipo=incidencia`, `?search=sensor`

### **6.2. Reportar Incidencia Manual / Alerta**
* **Método:** `POST`
* **URL:** `/api/v1/alertas`
* **Body:**
```json
{
  "tipo": "incidencia",
  "referencia_tipo": "equipamiento",
  "referencia_id": 1,
  "mensaje": "Falla en el sensor del simulador de paciente adulto. Requiere revisión técnica."
}
```
*(Tipos válidos: `conflicto_reserva`, `mantenimiento`, `equipo_desplazado`, `incidencia`, `sistema`)*

### **6.3. Resolver Alerta**
* **Método:** `PUT`
* **URL:** `/api/v1/alertas/{id}/resolver`
* **Body:**
```json
{
  "estado": "resuelta"
}
```
*(Estados válidos: `activa`, `resuelta`, `ignorada`)*

---

## 🤖 7. Módulo de Consultas e Interacciones IA (`/api/v1/consultas-ia`)

### **7.1. Enviar Consulta al Asistente IA**
* **Método:** `POST`
* **URL:** `/api/v1/consultas-ia`
* **Body:**
```json
{
  "pregunta": "¿Qué salas y espacios están libres hoy?"
}
```
* **Respuesta (201 Created):**
```json
{
  "message": "Consulta procesada exitosamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "usuario_nombre": "Administrador InnovaLab",
    "pregunta": "¿Qué salas y espacios están libres hoy?",
    "respuesta": "Actualmente hay 2 espacios operativos y disponibles para reserva...",
    "fecha": "2026-10-08T14:12:45+00:00"
  }
}
```

### **7.2. Listar Historial de Interacciones**
* **Método:** `GET`
* **URL:** `/api/v1/consultas-ia`
