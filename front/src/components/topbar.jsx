import { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import MyModal from './MyModal'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const { getRol, limpiarUsuario } = useContext(AuthContext)
  const [ mostrarModal, setMostrarModal ] = useState(false)
  const navigate = useNavigate()

  const location = useLocation()

  const path = location.pathname

  const pagina = path.split('/').pop()

  const cerrarSesion = async () => {
    await navigate("/login")
    limpiarUsuario()
    console.log('Sesion cerrada, se limpian credenciales de usuario')
  }

  const handleCancel = () =>{
    setMostrarModal(false)
  }

  const handleLogOut = () => {
    setMostrarModal(true)
  }

  

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-5">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">
          InnovaLab
        </NavLink>
        <span> {pagina} </span>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {getRol() && (
            <span className="ms-auto text-muted">
              Rol: <strong>{getRol()}</strong>
              <NavLink
                className="mx-3 btn btn-secondary"
                onClick={handleLogOut}
              >
                Cerrar sesion
              </NavLink>
            </span>
          )}
        </div>
      </div>

      {/* modal para confirmar cancelacion */}
      <MyModal
        title="Cerrar sesion"
        bodyMessage="Desea cerrar sesion?"
        mostrar={mostrarModal}
        handleConfirm={cerrarSesion}
        handleCancel={handleCancel}
      />
    </nav>
  )
}
