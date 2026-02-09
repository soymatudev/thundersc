import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

// Páginas
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import AlmacenesPage from '../features/almacenes/pages/AlmacenesPage';
import DepartamentosPage from '../features/departamentos/pages/DepartamentosPage';
import EmpleadosPage from '../features/empleados/pages/EmpleadosPage';
import EmpresasPage from '../features/empresas/pages/EmpresasPage';
import MarcasPage from '../features/marcas/pages/MarcasPage';
import ModulosPage from '../features/modulos/pages/ModulosPage';
import UsuariosPage from '../features/usuarios/pages/UsuariosPage';
import EntradaMasivaEquiposPage from '../features/equipos/pages/EntradaMasivaEquiposPage';
import EquiposPage from '../features/equipos/pages/EquiposPage';
import SensoresDashboard from '../features/sensores/SensoresDashboard';
import MovimientosInventarioPage from '../features/movimientos/MovimientosInventarioPage';
import ViajesPage from '../features/viajes/pages/ViajesPage';
import ViajeDetailPage from '../features/viajes/pages/ViajeDetailPage';
import ReporteGeneralEquipos from '../features/equipos/components/ReporteGeneralEquipos';
import BackupsMonitor from '../features/backups/components/BackupsMonitor';


// Componentes de ruta
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  const { loading } = useAuth();

  // Mostramos un spinner o nada mientras se verifica el estado de autenticación
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/almacenes"
          element={
            <ProtectedRoute>
              <AlmacenesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departamentos"
          element={
            <ProtectedRoute>
              <DepartamentosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados"
          element={
            <ProtectedRoute>
              <EmpleadosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresas"
          element={
            <ProtectedRoute>
              <EmpresasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marcas"
          element={
            <ProtectedRoute>
              <MarcasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modulos"
          element={
            <ProtectedRoute>
              <ModulosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <UsuariosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movimiento_sequipos"
          element={
            <ProtectedRoute>
              <EquiposPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipos"
          element={
            <ProtectedRoute>
              <EntradaMasivaEquiposPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sensores"
          element={
            <ProtectedRoute>
              <SensoresDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movimientos"
          element={
            <ProtectedRoute>
              <MovimientosInventarioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viajes"
          element={
            <ProtectedRoute>
              <ViajesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viajes/:id"
          element={
            <ProtectedRoute>
              <ViajeDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte_equipos"
          element={
            <ProtectedRoute>
              <ReporteGeneralEquipos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/backups"
          element={
            <ProtectedRoute>
              <BackupsMonitor />
            </ProtectedRoute>
          }
        />

        {/* Ruta para cuando no se encuentra la página */}
        <Route path="*" element={<div>404: Página no encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
