import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {user?.name}!</h1>
      <p>Esta es tu página de inicio. Desde aquí podrás navegar a los diferentes módulos.</p>
      
      <h2>Módulos a los que tienes acceso:</h2>
      <ul>
        {user?.modules?.map(module => <li key={module}>{module}</li>)}
      </ul>

      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default DashboardPage;
