import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Sidebar() {
  const { getRol, limpiarUsuario } = useContext(AuthContext)

  const handleLogOut = () => {
    alert('Sesión cerrada ' + getRol())
    limpiarUsuario()
  }

  return (
    <div className="d-flex">
      {/* Sidebar fijo */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: '220px' }}>
        <h4 className="mb-4">InnovaLab</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              className="nav-link text-white"
              to="/dashboard/listado_espacios"
            >
              Espacios
            </NavLink>
          </li>
          {getRol() === 'admin' && (
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/">
                Recursos (disabled)
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <NavLink
              className="nav-link text-white"
              to="/dashboard/nueva_actividad"
            >
              Actividades
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/dashboard/reservas">
              Reservas / Calendario
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/">
              Reportes / Dashboard Avanzado (disabled)
            </NavLink>
          </li>
        </ul>

        {getRol() && (
          <div className="mt-auto">
            <p className="text-muted">
              Rol: <strong>{getRol()}</strong>
            </p>
            <NavLink
              className="btn btn-secondary w-100"
              to="/login"
              onClick={handleLogOut}
            >
              Cerrar sesión
            </NavLink>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4">
        <h1>Contenido principal</h1>
      </div>
    </div>
  )
}
