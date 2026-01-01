import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Muestra un spinner o un componente de carga mientras se determina el estado de auth.
    // Esto previene un parpadeo de la página de login si el usuario ya está autenticado.
    return <div>Verificando sesión...</div>;
  }

  if (!user) {
    // Si no hay usuario, redirige a la página de login.
    // Se guarda la ubicación actual para poder redirigir de vuelta después del login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay un usuario, renderiza el componente hijo (la página protegida).
  return children;
};

export default ProtectedRoute;
