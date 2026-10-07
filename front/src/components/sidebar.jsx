import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Sidebar() {

   const  { getRol } = useContext(AuthContext)

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
      <h4 className="mb-4">Centro de simulacion</h4>
      <p>Rol: {getRol()}</p>

      <ul className="nav flex-column mt-5">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard">
            Inicio
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/dashboard/desarrollo"
          >
            Espacios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/dashboard/desarrollo"
          >
            Equipamiento
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/dashboard/desarrollo"
          >
            Mantenimiento
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/dashboard/desarrollo"
          >
            Actividades
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Calendario
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Alertas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Consultas IA
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/usuarios-y-roles">
            Usuarios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Configuracion
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
