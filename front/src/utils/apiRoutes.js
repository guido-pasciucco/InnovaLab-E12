// apiRoutes.js

const SERVIDOR_PATH = ""
const PUERTO = ""
const API_BASE = `http://${SERVIDOR_PATH}:${PUERTO}/api/v1`;


// Login: Conecten el form a POST /api/v1/auth/login.
export const LOGIN = `${API_BASE}/auth/login`

// Persistencia del usuario (/me): Al recargar la app, llamen a GET /api/v1/auth/me para mantener la sesión viva y sacar el nombre + rol.

export const PERSISTENCIA = `${API_BASE}/auth/me`

// Logout: Manden POST /api/v1/auth/logout para revocar el token.

export const LOGOUT = `${API_BASE}/logout`


// Ruta base de espacios
export const ESPACIOS_ROUTE = `${API_BASE}/espacios`;

// Helper para armar la URL con query params
export const ESPACIOS_LISTADO = ({ search = "", tipo = "", estado = "" } = {}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (tipo) params.append("tipo", tipo);
  if (estado) params.append("estado", estado);

  return `${ESPACIOS_ROUTE}?${params.toString()}`;
};


// Alta y Edición: Conecten los modales/forms a POST /api/v1/espacios y PUT /api/v1/espacios/{id}.
// Alta (POST)
export const CREATE_ESPACIO_ROUTE = ESPACIOS_ROUTE;

// Edición (PUT con ID dinámico)
export const UPDATE_ESPACIO_ROUTE = (id) => `${ESPACIOS_ROUTE}/${id}`;


// Rutas de Equipamiento
export const EQUIPAMIENTO_ROUTE = `${API_BASE}/equipamiento`;

// Listado con filtro de movilidad (?tipo_movilidad=trasladable|fijo)
export const EQUIPAMIENTO_LISTADO = ({ tipo_movilidad = "" } = {}) => {
  const params = new URLSearchParams();
  if (tipo_movilidad) params.append("tipo_movilidad", tipo_movilidad);
  return `${EQUIPAMIENTO_ROUTE}?${params.toString()}`;
};

// Visualización de ubicaciones (espacio habitual vs actual)
export const EQUIPAMIENTO_BY_ID = (id) => `${EQUIPAMIENTO_ROUTE}/${id}`;

// Traslados/Mantenimiento (PUT con ID dinámico)
export const UPDATE_EQUIPAMIENTO_ROUTE = (id) => `${EQUIPAMIENTO_ROUTE}/${id}`;