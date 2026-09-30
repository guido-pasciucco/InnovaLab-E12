import { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children, protectedRoles = [] }) {
  const navigate = useNavigate()

  // verificamos que hay usuario en authcontext
  const { role } = useContext(AuthContext)

  if (!role) {
    return <Navigate to={'/login'} replace />
  }

  if (protectedRoles && !protectedRoles.includes(role)) {
    return <Navigate to={'/dashboard'} replace />
  }

  return children
}
