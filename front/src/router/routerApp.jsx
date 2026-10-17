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
import { listaEspacios } from "../services/espacios";
import { listaReservas } from "../services/reservas";
import UsuariosYrolesPage from "../pages/usuariosYrolesPage";
import ReservationTable from "../components/reservationTable";
import ReservationForm from "../components/reservationForm";
import EquipamientoPage from "../pages/EquipamientoPage";
import EspacioDetallePage from "../pages/EspacioDetallePage";

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
                  protectedRoles={["Administrador", "coordinador"]}
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
                  protectedRoles={["Administrador", "coordinador"]}
                >
                  <h1 className="h1"> Paniga en desarrollo</h1>
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios-y-roles"
              element={
                <ProtectedRoute protectedRoles={["Administrador"]}>
                  <UsuariosYrolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios"
              element={
                <ProtectedRoute
                  protectedRoles={["Administrador", "coordinador"]}
                >
                  <ListadoEspaciosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="espacios/:id"
              element={
                <ProtectedRoute protectedRoles={["Administrador", "Coordinador"]}>
                  <EspacioDetallePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="equipamiento"
              element={
                <ProtectedRoute
                  protectedRoles={["Administrador", "coordinador"]}
                >
                  <EquipamientoPage />
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
