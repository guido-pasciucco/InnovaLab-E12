import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children, protectedRoles = [] }) {

  // verificamos que hay usuario en authcontext
  const { getRol } = useContext(AuthContext)

  if (!getRol()) {
    alert('Por favor inicia sesión para acceder a esta ruta')
    return <Navigate to={'/login'} replace />
  }

  if (protectedRoles && !protectedRoles.includes(getRol())) {
    alert('No tienes permisos para acceder a esta ruta, por favor inicia sesión')
    return <Navigate to={'/dashboard'} replace />
  }

  return children
}
