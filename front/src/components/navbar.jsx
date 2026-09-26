import { NavLink } from "react-router-dom";

export default function Navbar() {

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">
          Navbar
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
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard/listado_espacios">
                Espacios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Recursos (disabled)
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard/nueva_actividad">
                Actividades
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard/reservas">
                Reservas / Calendario
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Reportes / Dashboard Avanzado (disabled)
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
