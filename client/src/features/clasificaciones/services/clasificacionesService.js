import { api } from '../../../shared/services/ApiClient';

const CLASIFICACIONES_ENDPOINT = '/clasificaciones_equipos';

export const ClasificacionesService = {
  
  /**
   * Obtiene todas las clasificaciones.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    return api.get(`${CLASIFICACIONES_ENDPOINT}/all`);
  },

  /**
   * Obtiene las clasificaciones de forma paginada.
   * @param {number} page 
   * @param {number} limit 
   * @param {string} descri 
   * @returns {Promise<Object>}
   */
  getPaginated: async (page, limit, descri) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('pageSize', limit);
    if (descri) params.append('descri', descri);
    return api.get(`${CLASIFICACIONES_ENDPOINT}?${params.toString()}`);
  },

  /**
   * Obtiene una clasificación por su ID.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    return api.get(`${CLASIFICACIONES_ENDPOINT}/${id}`);
  },

  /**
   * Crea una nueva clasificación.
   * @param {object} data - Datos de la clasificación a crear.
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    return api.post(CLASIFICACIONES_ENDPOINT, data);
  },

  /**
   * Actualiza una clasificación existente.
   * @param {number} id 
   * @param {object} data - Datos de la clasificación a actualizar.
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    return api.put(`${CLASIFICACIONES_ENDPOINT}/${id}`, data);
  },

  /**
   * Elimina una clasificación.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    return api.delete(`${CLASIFICACIONES_ENDPOINT}/${id}`);
  },
};

