import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "../layout/layout";

import LoginPage from "../pages/loginPage";
import DashboardPrincipalPage from "../pages/dashboardPrincipalPage";
import ListadoEspaciosPage from "../pages/listadoEspaciosPage";
import ProtectedRoute from "./ProtectedRoute";
import UsuariosYrolesPage from "../pages/usuariosYrolesPage";
import ListadoEquipamientoPage from "../pages/listadoEquipamientoPage"
import EspacioDetallePage from "../pages/EspacioDetallePage";
import ListadoReservasPage from "../pages/ListadoReservasPage";
import ResolverConflictoPage from "../pages/resolverConflictoPage";
import EditarEspacioPage from "../pages/editarEspacioPage";
import NuevaReservaPage from "../pages/nuevaReservaPage";
import AlertasPage from "../pages/alertas/AlertasPage";
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
                  protectedRoles={["Admin InnovaLab", "coordinador"]}
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
                  protectedRoles={["Admin InnovaLab", "coordinador"]}
                >
                  <h1 className="h1"> Paniga en desarrollo</h1>
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios-y-roles"
              element={
                <ProtectedRoute protectedRoles={["Admin InnovaLab"]}>
                  <UsuariosYrolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios"
              element={
                <ProtectedRoute
                  protectedRoles={["Admin InnovaLab", "coordinador"]}
                >
                  <ListadoEspaciosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios/:id"
              element={
                <ProtectedRoute protectedRoles={["Admin InnovaLab", "Coordinador"]}>
                  <EspacioDetallePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="equipamiento"
              element={
                <ProtectedRoute
                  protectedRoles={["Admin InnovaLab", "coordinador"]}
                >
                  <ListadoEquipamientoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="nueva-reserva"
              element={
                <ProtectedRoute
                  protectedRoles={["Admin InnovaLab", "coordinador"]}
                >
                  <NuevaReservaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="resolver-conflicto"
              element={
                <ProtectedRoute protectedRoles={["Admin InnovaLab", "coordinador"]}>
                  <ResolverConflictoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios/:id/editar-espacio"
              element={
                <ProtectedRoute protectedRoles={["Admin InnovaLab", "coordinador"]}>
                  <EditarEspacioPage />
                </ProtectedRoute>
              }
            />

            <Route 
              path="alertas"
              element={
                <ProtectedRoute protectedRoles = {["Admin InnovaLab", "coordinador"]}>
                  <AlertasPage />
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
  );
}
