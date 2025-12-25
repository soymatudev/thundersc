import { createContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

// 1. Crear el contexto
export const AuthContext = createContext();

// 2. Crear el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para verificar la sesión al cargar

  // Función para verificar si hay una sesión activa al cargar la app
  const checkAuth = async () => {
    try {
      const { user } = await AuthService.getProfile(); 
      setUser(user);
    } catch (error) {
      console.log('No active session found.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await AuthService.logoutUser();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
    }
  };

  const authContextValue = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
