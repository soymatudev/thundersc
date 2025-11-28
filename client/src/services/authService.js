// En este archivo configuraremos la comunicación con el backend para la autenticación.
import { api } from './ApiClient'; // Suponiendo que tenemos un archivo api.js para la config de fetch/axios

/**
 * Llama al endpoint de login del backend.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: object, token: string}>}
 */

export const AuthService = {

  loginUser: async (userData) => {
      return api.post('/auth/login', userData);
  },

  registerUser: async (userData) => {
      return api.post('/auth/register', userData);
  },

  logoutUser: async () => {
      return api.post('/auth/logout');
  },

  getProfile: async () => {
      return api.get('/auth/profile');
  },

};
