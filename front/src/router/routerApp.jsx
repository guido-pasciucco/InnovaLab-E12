import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Layout from '../layout/layout'

import LoginPage from '../pages/login/loginPage'
import DashboardPrincipalPage from '../pages/dashboard/dashboardPrincipalPage'
import ListadoEspaciosPage from '../pages/espacios/listadoEspaciosPage'
import ProtectedRoute from './ProtectedRoute'
import UsuariosYrolesPage from '../pages/usuarios/usuariosYrolesPage'
import ListadoEquipamientoPage from '../pages/equipamientos/listadoEquipamientoPage'
import EspacioDetallePage from '../pages/espacios/EspacioDetallePage'
import ListadoReservasPage from '../pages/reservas/ListadoReservasPage'
import ResolverConflictoPage from '../pages/conflictos/resolverConflictoPage'
import EditarEspacioPage from '../pages/espacios/editarEspacioPage'
import NuevaReservaPage from '../pages/reservas/nuevaReservaPage'
import CalendarioReservasPage from '../pages/calendario/calendarioReservasPage'
// import {listaEspacios} from "../services/espacios";

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
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <DashboardPrincipalPage />
                </ProtectedRoute>
              }
            />
            {/* se definiran las proximas rutas protegidas en etapas mas avanzadas */}
            <Route
              path="desarrollo"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <h1 className="h1"> Paniga en desarrollo</h1>
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios-y-roles"
              element={
                <ProtectedRoute protectedRoles={['Admin']}>
                  <UsuariosYrolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <ListadoEspaciosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios/:id"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <EspacioDetallePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="equipamiento"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <ListadoEquipamientoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="nueva-reserva"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <NuevaReservaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="resolver-conflicto"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <ResolverConflictoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios/:id/editar-espacio"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <EditarEspacioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="calendario"
              element={
                <ProtectedRoute
                  protectedRoles={[
                    'Admin InnovaLab',
                    'Coordinador',
                    'Coordinadora',
                  ]}
                >
                  <CalendarioReservasPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* agarrar todas */}
          <Route
            path="*"
            element={<h1 className="h1"> Pagina no encontrada</h1>}
          />
        </Routes>
      </Router>
    </>
  )
}
