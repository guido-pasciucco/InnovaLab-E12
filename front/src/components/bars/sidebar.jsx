
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { Row, Col } from 'react-bootstrap'
import {
  House,
  DoorOpen,
  Laptop,
  Calendar,
  Bell,
  ChatDots,
  People,
  List,
  ChevronLeft,
  ChevronRight,
  X,
} from 'react-bootstrap-icons'

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { getRol } = useContext(AuthContext)
  const rol = getRol()

  const links = [
    { to: '/dashboard', label: 'Inicio', icon: <House /> },
    { to: '/dashboard/espacios', label: 'Espacios', icon: <DoorOpen /> },
    { to: '/dashboard/equipamiento', label: 'Equipamiento', icon: <Laptop /> },
    { to: '/dashboard/actividades', label: 'Actividades', icon: <List /> },
    { to: '/dashboard/calendario', label: 'Calendario', icon: <Calendar /> },
    { to: '/dashboard/alertas', label: 'Alertas', icon: <Bell /> },
    { to: '/dashboard/chatia', label: 'Consultas IA', icon: <ChatDots /> },
    ...(rol === 'Admin'
      ? [
          {
            to: '/dashboard/usuarios-y-roles',
            label: 'Usuarios',
            icon: <People />,
          },
        ]
      : []),
  ]

  return (
    <>
      {/* Fondo oscuro para dispositivos móviles */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar text-white p-3 d-flex flex-column background-primary ${
          mobileOpen ? 'sidebar-open' : ''
        }`}
        style={{
          width: collapsed ? '103px' : '240px',
        }}
      >
        {/* Encabezado */}
        <Row className="align-items-center">
          <Col className="d-flex align-items-center gap-2">
            <img
              src="/icon_cs.png"
              alt="InnovaLab"
              width={34}
              height={34}
            />
            {!collapsed && <span>Innova.lab</span>}
          </Col>

          {/* Botón cerrar móvil */}
          <Col xs="auto" className="d-lg-none">
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
            >
              <X />
            </button>
          </Col>
        </Row>

        {!collapsed && (
          <>
            <h5 className="mt-3 mb-2">Centro de simulación</h5>
            <h6 className="small text-secondary">Rol: {rol}</h6>
          </>
        )}

        {/* Contraer / expandir escritorio */}
        <button
          type="button"
          className="btn btn-outline-light btn-sm mt-4 d-none d-lg-block"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        {/* Navegación */}
        <ul className="nav flex-column mt-4 gap-2">
          {links.map((link) => (
            <li className="nav-item" key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/dashboard'}
                onClick={() => setMobileOpen(false)}
                className="nav-link text-white d-flex align-items-center gap-3"
                title={collapsed ? link.label : ''}
              >
                {link.icon}
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
