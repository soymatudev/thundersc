import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Páginas
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage'; // Lo crearemos en breve

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
        
        {/* Aquí irían más rutas protegidas para los módulos */}
        {/* Ejemplo:
        <Route 
          path="/almacenes" 
          element={
            <ProtectedRoute>
              <AlmacenesPage />
            </ProtectedRoute>
          } 
        /> 
        */}

        {/* Ruta para cuando no se encuentra la página */}
        <Route path="*" element={<div>404: Página no encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
