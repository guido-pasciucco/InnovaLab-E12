export default function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          Navbar
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Espacios
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Recursos
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Actividades
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Reservas/ Calendario
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Reportes / Dashboard Avanzado
              </a>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  )
}
