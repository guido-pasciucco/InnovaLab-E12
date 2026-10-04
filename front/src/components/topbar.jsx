import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Topbar() {
  const { getRol, limpiarUsuario } = useContext(AuthContext)


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
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
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
