import { api } from '../../../shared/services/ApiClient';

const AUTH_ENDPOINT = '/auth';

export const UsuariosService = {
  
  getPaginated: async (page, pageSize, descri) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (descri) params.append('descri', descri);
    return api.get(`${AUTH_ENDPOINT}/users/paginated?${params.toString()}`);
  },

  /**
   * Crea un nuevo usuario con sus permisos.
   * @param {object} payload - { userData, usuarioPermisoData }
   * @returns {Promise<Object>}
   */
  create: async (payload) => {
    return api.post(`${AUTH_ENDPOINT}/register`, payload);
  },

  /**
   * Actualiza un usuario existente y sus permisos.
   * @param {number} cve - Clave del usuario
   * @param {object} payload - { userData, usuarioPermisoData }
   * @returns {Promise<Object>}
   */
  update: async (cve, payload) => {
    return api.put(`${AUTH_ENDPOINT}/profile/${cve}`, payload);
  },

  /**
   * Elimina un usuario.
   * NOTA: Este endpoint es una suposición y podría necesitar ser creado en el backend.
   * @param {number} cve
   * @returns {Promise<Object>}
   */
  delete: async (cve) => {
    // Asumiendo un endpoint /users/:cve que no existe actualmente
    return api.delete(`${AUTH_ENDPOINT}/users/${cve}`);
  },
};
