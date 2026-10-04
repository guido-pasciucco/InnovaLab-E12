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
    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{
        width: '220px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
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
          <NavLink
            className="nav-link text-white"
            to="/dashboard/reservas"
          >
            Reservas / Calendario
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/">
            Reportes / Dashboard Avanzado (disabled)
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

