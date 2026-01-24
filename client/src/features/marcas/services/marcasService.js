import { api } from '../../../shared/services/ApiClient';

const MARCAS_ENDPOINT = '/marcas';

export const MarcasService = {
  
  /**
   * Obtiene todas las marcas.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    return api.get(MARCAS_ENDPOINT);
  },

  /**
   * Obtiene las marcas de forma paginada.
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<Object>}
   */
  getPaginated: async (page, limit, descri) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('pageSize', limit);
    if (descri) params.append('descri', descri);
    return api.get(`${MARCAS_ENDPOINT}?${params.toString()}`);
  },

  /**
   * Obtiene una marca por su ID.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    return api.get(`${MARCAS_ENDPOINT}/${id}`);
  },

  /**
   * Crea una nueva marca.
   * @param {object} marcaData - Datos de la marca a crear.
   * @returns {Promise<Object>}
   */
  create: async (marcaData) => {
    return api.post(MARCAS_ENDPOINT, marcaData);
  },

  /**
   * Actualiza una marca existente.
   * @param {number} id 
   * @param {object} marcaData - Datos de la marca a actualizar.
   * @returns {Promise<Object>}
   */
  update: async (id, marcaData) => {
    return api.put(`${MARCAS_ENDPOINT}/${id}`, marcaData);
  },

  /**
   * Elimina una marca.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    return api.delete(`${MARCAS_ENDPOINT}/${id}`);
  },
};
