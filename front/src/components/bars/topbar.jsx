import { useContext, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import ConfirmModal from '../modals/ConfirmModal'
import { logoutPost } from '../../services/apiRoutes'

import { House, BoxArrowRight } from 'react-bootstrap-icons'

export default function Topbar() {
  const { getRol, limpiarUsuario, getTokken } = useContext(AuthContext)
  const [mostrarModal, setMostrarModal] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const pagina = location.pathname.split('/').pop()

  const cerrarSesion = async () => {
    await logoutPost(getTokken())
    limpiarUsuario()
    navigate('/login')
  }

  const handleLogOut = () => {
    setMostrarModal(true)
  }

  const handleCancel = () => {
    setMostrarModal(false)
  }

  return (
    <>
      <nav className="navbar bg-body-tertiary mb-4 px-2 px-md-3">
        <div className="container-fluid d-flex flex-wrap align-items-center gap-2">
          {/* Marca */}
          <NavLink className="navbar-brand mb-0" to="/dashboard">
            <House className="me-2" size={20} />
            InnovaLab
          </NavLink>

          {/* Página actual */}
          <span className="text-capitalize text-secondary">{pagina}</span>

          {/* Rol y cerrar sesión */}
          <div className="ms-auto d-flex align-items-center gap-2">
            <span className="text-muted small">
              Rol:{' '}
              <strong>
                {getRol() === 1
                  ? 'Admin'
                  : getRol() === 2
                    ? 'Coordinador'
                    : 'Sin rol'}
              </strong>{' '}
            </span>

            <button className="btn btn-secondary" onClick={handleLogOut}>
              <BoxArrowRight className="me-1" />
              <span className="d-none d-sm-inline">Cerrar sesión</span>
              <span className="d-sm-none">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <ConfirmModal
        title="Cerrar sesión"
        bodyMessage="Confirme cerrar sesion"
        mostrar={mostrarModal}
        handleConfirm={cerrarSesion}
        handleCancel={handleCancel}
      />
    </>
  )
}
