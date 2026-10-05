import { useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Topbar() {
  const { getRol, limpiarUsuario } = useContext(AuthContext)

  const location = useLocation()

  const path = location.pathname

  const pagina = path.split("/").pop();



  const handleLogOut= () =>{
    alert("sesion cerrada " + getRol())
    limpiarUsuario()
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">
          InnovaLab
        </NavLink>
        <span> {pagina} </span>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          
          {getRol() && (
            <span className="ms-auto text-muted">
              Rol: <strong>{getRol()}</strong>
              <NavLink className="mx-3 btn btn-secondary" to='/login' onClick={handleLogOut}>Cerrar sesion</NavLink>
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}
