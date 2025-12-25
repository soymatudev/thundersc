import { api } from './ApiClient';

const ALMACENES_ENDPOINT = '/almacenes';

export const AlmacenesService = {
  
  /**
   * Obtiene todos los almacenes.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    return api.get('/almacenes');
  },

  getPaginated: async (page, pageSize, descri) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (descri) params.append('descri', descri);
    return api.get(`/almacenes/paginated?${params.toString()}`);
  },

  /**
   * Obtiene un almacén por su ID.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    return api.get(`${ALMACENES_ENDPOINT}/${id}`);
  },

  /**
   * Crea un nuevo almacén.
   * @param {object} almacenData - Datos del almacén a crear.
   * @returns {Promise<Object>}
   */
  create: async (almacenData) => {
    return api.post(ALMACENES_ENDPOINT, almacenData);
  },

  /**
   * Actualiza un almacén existente.
   * @param {number} id 
   * @param {object} almacenData - Datos del almacén a actualizar.
   * @returns {Promise<Object>}
   */
  update: async (id, almacenData) => {
    return api.put(`${ALMACENES_ENDPOINT}/${id}`, almacenData);
  },

  /**
   * Elimina un almacén.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    return api.put(`${ALMACENES_ENDPOINT}/delete/${id}`);
  },

};
