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
import ActividadesPage from '../pages/actividades/ActividadesPage'
import NuevaActividadPage from '../pages/actividades/nuevaActividadPage'
import AlertasPage from '../pages/alertas/AlertasPage'
import ChatIaPage from '../pages/chatIa/chatIaPage'
// import {listaEspacios} from "../services/espacios";
import EquipamientoDetallePage from '../pages/equipamientos/EquipamientoDetallePage'
import NotFound from '../pages/not_found/NotFound'
import InfoPage from '../pages/info/InfoPage'

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
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <DashboardPrincipalPage />
                </ProtectedRoute>
              }
            />
            {/* se definiran las proximas rutas protegidas en etapas mas avanzadas */}
            <Route
              path="desarrollo"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <h1 className="h1"> Paniga en desarrollo</h1>
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios-y-roles"
              element={
                <ProtectedRoute protectedRoles={[1]}>
                  <UsuariosYrolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <ListadoEspaciosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios/:id"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <EspacioDetallePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="equipamiento"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <ListadoEquipamientoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="equipamiento/:id"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <EquipamientoDetallePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="nueva-reserva"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <NuevaReservaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="resolver-conflicto"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <ResolverConflictoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios/:id/editar-espacio"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <EditarEspacioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="calendario"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <CalendarioReservasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="nueva-actividad"
              element={
                <ProtectedRoute
                  protectedRoles={['Admin', 'Coordinador', 'Coordinadora']}
                >
                  <NuevaActividadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="actividades"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <ActividadesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="alertas"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <AlertasPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="chatia"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <ChatIaPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="info"
              element={
                <ProtectedRoute protectedRoles={[1, 2]}>
                  <InfoPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* agarrar todas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}
