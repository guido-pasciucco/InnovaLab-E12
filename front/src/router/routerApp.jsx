import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Layout from '../layout/layout'

import Home from '../components/home'
import About from '../components/about'
import LoginPage from '../pages/loginPage'
import DashboardPrincipalPage from '../pages/dashboardPrincipalPage'
import CalendarioReservasPage from '../pages/calendarioReservasPage'
import DetalleEspacio from '../pages/detalleEspacio'
import ListadoEspaciosPage from '../pages/listadoEspaciosPage'
import NuevaActividadPage from '../pages/nuevaActividadPage'

export default function RouterApp() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard con Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<DashboardPrincipalPage />} />
            <Route
              path="reservas"
              element={<CalendarioReservasPage />}
            />
            <Route path="detalle_espacio" element={<DetalleEspacio />} />
            <Route path="listado_espacios" element={<ListadoEspaciosPage />} />
            <Route path="nueva_actividad" element={<NuevaActividadPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}
