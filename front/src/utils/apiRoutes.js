// definición de rutas de la API remota
const API_BASE =
  import.meta.env.VITE_API_BASE || 'https://innovalab-e12.onrender.com'

// Login: Conecten el form a POST /api/v1/auth/login.
const LOGIN = `${API_BASE}/api/v1/auth/login`

// Logout: Manden POST /api/v1/auth/logout para revocar el token.
const LOGOUT = `${API_BASE}/api/v1/auth/logout`

// Persistencia del usuario (/me): Al recargar la app, llamen a GET /api/v1/auth/me para mantener la sesión viva y sacar el nombre + rol.

const PERSISTENCIA = `${API_BASE}/auth/me`

// Helper para armar la URL con query params
const ESPACIOS_LISTADO = ({ search = '', tipo = '', estado = '' } = {}) => {
  const params = new URLSearchParams()

  if (search) params.append('search', search)
  if (tipo) params.append('tipo', tipo)
  if (estado) params.append('estado', estado)

  return `${ESPACIOS_ROUTE}?${params.toString()}`
}

// Alta y Edición: Conecten los modales/forms a POST /api/v1/espacios y PUT /api/v1/espacios/{id}.
// Alta (POST)
// const CREATE_ESPACIO_ROUTE = ESPACIOS_ROUTE

// // Edición (PUT con ID dinámico)
// const UPDATE_ESPACIO_ROUTE = (id) => `${ESPACIOS_ROUTE}/${id}`

// Listado con filtro de movilidad (?tipo_movilidad=trasladable|fijo)
const EQUIPAMIENTO_LISTADO = ({ tipo_movilidad = '' } = {}) => {
  const params = new URLSearchParams()
  if (tipo_movilidad) params.append('tipo_movilidad', tipo_movilidad)
  return `${EQUIPAMIENTO_ROUTE}?${params.toString()}`
}

// Visualización de ubicaciones (espacio habitual vs actual)
const EQUIPAMIENTO_BY_ID = (id) => `${EQUIPAMIENTO_ROUTE}/${id}`

// Traslados/Mantenimiento (PUT con ID dinámico)
const UPDATE_EQUIPAMIENTO_ROUTE = (id) => `${EQUIPAMIENTO_ROUTE}/${id}`

// agregamos axios para hacer las consultas

import axios from 'axios'
import { data } from 'react-router-dom'

export const loginPostCredentials = async (credentials) => {
  console.log('Haciendo login desde: ', API_BASE)
  const res = await axios.post(LOGIN, credentials)
  return res
}

export const logoutPost = async (token) => {
  console.log('cerrando sesion en api...', token)

  const res = await api.post(LOGOUT, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  console.log('sesion en api cerrado: ', res.data)
}

export const api = axios.create({ baseURL: API_BASE })

export const getEspaciosApi = async (token) => {
  const res = await api.get(ESPACIOS_ROUTE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res
}

//gestión de espacios
const ESPACIOS_ROUTE = `/api/v1/espacios`

export const getEspaciosApiId = async (token, id) => {
  const ruta = `${ESPACIOS_ROUTE}/${id}`
  console.log('Haciendo consulta a api ruta: ', ruta)
  const res = await api.get(ruta, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res
}

export const postEspaciosApi = async (data, token) => {
  try {
    const res = await api.post(ESPACIOS_ROUTE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res
  } catch (err) {
    console.log('error', err.response?.data)
    throw err
  }
}


const DASHBOARD_ROUTE = `${API_BASE}/api/v1/dashboard/resumen`
export const getDashboardApi = async (token) => {
  try {
    console.log('Servicio api get dashboard...')
    const res = await api.get(DASHBOARD_ROUTE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res
  } catch (err) {
    throw err
  }
}


//gestión de equipamiento
const EQUIPAMIENTO_ROUTE = `/api/v1/equipamiento`

export const getEquipamientoApi = async (token) => {
  const res = await api.get(EQUIPAMIENTO_ROUTE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res
}

export const postEquipamientoApi = async (data, token) => {
  try {
    const res = await api.post(EQUIPAMIENTO_ROUTE, data, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    return res;
  } catch (err) {
    console.log("error", err.response?.data);
    throw err;
  }
};


// gestion de usuarios 
const GESTION_USUARIOS_ROUTE = `${API_BASE}/api/v1/usuarios`

export const getUsuarios = async (token) =>{
  const res = await api.get(GESTION_USUARIOS_ROUTE,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  return res.data
} 

export const postUsuarios = async (token, data) => {
  const res = await api.post(GESTION_USUARIOS_ROUTE, data, {
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
}



// gestion de actividades
const GESTION_DE_ACTIVIDADES = `${API_BASE}/api/v1/actividades`

export const getActividades = async (token) =>{
  const res = await api.get(GESTION_DE_ACTIVIDADES,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })

  return res
}


//gestion alertas
const GESTION_ALERTAS_ROUTE = `${API_BASE}/api/v1/alertas`

export const getAlertas = async (token) =>{
  const res = await api.get(GESTION_ALERTAS_ROUTE, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data
}


// modulo IA
const CHAT_IA_ROUTE = `${API_BASE}/api/v1/consultas-ia`

export const postChatIa = async (token, pregunta) =>{

  const res = await api.post(CHAT_IA_ROUTE, {pregunta} ,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })

  return res.data
}


//gestión de reservas
const RESERVAS_ROUTE = `/api/v1/reservas`

export const getReservas = async (token) => {
  const res = await api.get(RESERVAS_ROUTE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res
}

export const postReservas = async (data, token) => {
  try {
    const res = await api.post(RESERVAS_ROUTE, data, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    return res;
  } catch (err) {
    console.log("error", err.response?.data);
    throw err;
  }
};