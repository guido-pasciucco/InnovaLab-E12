// definición de rutas de la API remota
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Login: Conecten el form a POST /api/v1/auth/login.
const LOGIN = `${API_BASE}/api/v1/auth/login`;

// Logout: Manden POST /api/v1/auth/logout para revocar el token.
const LOGOUT = `${API_BASE}/api/v1/auth/logout`;

// Persistencia del usuario (/me): Al recargar la app, llamen a GET /api/v1/auth/me para mantener la sesión viva y sacar el nombre + rol.

const PERSISTENCIA = `${API_BASE}/auth/me`;

// Ruta base de espacios
const ESPACIOS_ROUTE = `/api/v1/espacios`;

// Helper para armar la URL con query params
const ESPACIOS_LISTADO = ({
  search = "",
  tipo = "",
  estado = "",
} = {}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (tipo) params.append("tipo", tipo);
  if (estado) params.append("estado", estado);

  return `${ESPACIOS_ROUTE}?${params.toString()}`;
};

// Alta y Edición: Conecten los modales/forms a POST /api/v1/espacios y PUT /api/v1/espacios/{id}.
// Alta (POST)
const CREATE_ESPACIO_ROUTE = ESPACIOS_ROUTE;

// Edición (PUT con ID dinámico)
const UPDATE_ESPACIO_ROUTE = (id) => `${ESPACIOS_ROUTE}/${id}`;

// Rutas de Equipamiento
const EQUIPAMIENTO_ROUTE = `${API_BASE}/equipamiento`;

// Listado con filtro de movilidad (?tipo_movilidad=trasladable|fijo)
const EQUIPAMIENTO_LISTADO = ({ tipo_movilidad = "" } = {}) => {
  const params = new URLSearchParams();
  if (tipo_movilidad) params.append("tipo_movilidad", tipo_movilidad);
  return `${EQUIPAMIENTO_ROUTE}?${params.toString()}`;
};

// Visualización de ubicaciones (espacio habitual vs actual)
const EQUIPAMIENTO_BY_ID = (id) => `${EQUIPAMIENTO_ROUTE}/${id}`;

// Traslados/Mantenimiento (PUT con ID dinámico)
const UPDATE_EQUIPAMIENTO_ROUTE = (id) => `${EQUIPAMIENTO_ROUTE}/${id}`;


// agregamos axios para hacer las consultas

import axios from "axios"
import { data } from "react-router-dom";

export const loginPostCredentials = async (credentials) => {
  console.log("Haciendo login desde: ", API_BASE)

  try{
    const res = await axios.post(LOGIN, credentials)
    console.log(res)
    return res
  }
  catch (err){
    throw new Error(err)
  }
}

export const logoutPost = async () =>{
  console.log("cerrando sesion en api...")
  const res = await api.post(LOGOUT)
  console.log("sesion en api cerrado: ", res.data)
}

export const api = axios.create(
  {baseURL: API_BASE}
)

export const configApiInterceptor = (token) =>{
  api.interceptors.request.use(
    (config) =>{
      if(token){
        config.headers.Authorization= `Bearer ${token}`
      }
      console.log("seteado el config en: ", config.headers)
      return config
    },
    (error) => Promise.reject(error)
    
  )

}

export const getEspaciosApi = async() => {
  const res = await api.get(ESPACIOS_ROUTE)
  return res
}

export const postEspaciosApi = async (data) =>{
  try{
    const res = await api.post(ESPACIOS_ROUTE, data)
    return res
  }catch(err){
    console.log("erroooor", err.response?.data)
    return err
  }
  
}