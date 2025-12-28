import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await AuthService.loginUser({ username, password });
      const userProfile = await AuthService.getProfile();
      login(userProfile);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas o error en el servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        
        <div className="text-center mb-6">
          <svg className="mx-auto h-12 w-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-100">
            Thunder
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="username"
            label="Usuario"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="email"
            required
            disabled={loading}
          />

          <Input
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"/>
              <label htmlFor="remember-me" className="ml-2 block text-gray-300">
                Recordarme
              </label>
            </div>

            {/* <div className="font-medium text-indigo-500 hover:text-indigo-400">
              <a href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div> */}
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <Button type="submit" fullWidth={true} disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
