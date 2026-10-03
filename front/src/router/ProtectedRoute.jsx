import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children, protectedRoles = [] }) {

  // verificamos que hay usuario en authcontext
  const { getRol } = useContext(AuthContext)

  if (!getRol()) {
    return <Navigate to={'/login'} replace />
  }

  if (protectedRoles && !protectedRoles.includes(getRol())) {
    return <Navigate to={'/dashboard'} replace />
  }

  return children
}
