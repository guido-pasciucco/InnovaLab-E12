import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Layout from '../layout/layout'


import LoginPage from '../pages/loginPage'
import DashboardPrincipalPage from '../pages/dashboardPrincipalPage'
import CalendarioReservasPage from '../pages/calendarioReservasPage'
import DetalleEspacio from '../pages/detalleEspacio'
import ListadoEspaciosPage from '../pages/listadoEspaciosPage'
import NuevaActividadPage from '../pages/nuevaActividadPage'
import ProtectedRoute from './ProtectedRoute'

export default function RouterApp() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard con Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute
                  protectedRoles={[
                    'admin',
                    'cordinador',
                  ]}
                >
                  <DashboardPrincipalPage />
                </ProtectedRoute>
              }
            />
            {/* se definiran las proximas rutas protegidas en etapas mas avanzadas */}
            <Route
            path='desarrollo'
            element={
              <ProtectedRoute
              protectedRoles={['admin','cordinador',]}

              >
                <h1 className='h1'> Paniga en desarrollo</h1>
              </ProtectedRoute>
            }
            />
          </Route>

          {/* agarrar todas */}
          <Route path='*' element={ <h1 className='h1'> Pagina no encontrada</h1>} />

        </Routes>
      </Router>
    </>
  )
}
