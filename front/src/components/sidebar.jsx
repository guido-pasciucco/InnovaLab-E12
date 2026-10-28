import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Row, Col } from 'react-bootstrap'

export default function Sidebar() {
  const { getRol } = useContext(AuthContext)

  return (
    <div
      className="text-white p-3 d-flex flex-column background-primary overflow-y-auto"
      style={{
        width: '220px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <Row>
        <Col className='m-3'>
          <img src="/icon_cs.png" alt="" width={34} height={34} className='mx-1' />
          <span>Innova.lab</span>
        </Col>
      </Row>

      <h5 className="mb-4">Centro de simulacion</h5>
      <h6 className='small text-secondary'>Rol: {getRol()}</h6>

      <ul className="nav flex-column mt-5">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard">
            Inicio
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/espacios">
            Espacios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/equipamiento">
            Equipamiento
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Mantenimiento
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
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
            Alertas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/desarrollo">
            Consultas IA
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/dashboard/usuarios-y-roles"
          >
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
