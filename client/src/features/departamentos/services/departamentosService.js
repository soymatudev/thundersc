import { api } from '../../../shared/services/ApiClient';

const DEPARTAMENTOS_ENDPOINT = '/departamentos';

export const DepartamentosService = {
  
  /**
   * Obtiene todos los departamentos.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    return api.get(DEPARTAMENTOS_ENDPOINT);
  },

  getPaginated: async (page, pageSize, descri) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (descri) params.append('descri', descri);
    return api.get(`${DEPARTAMENTOS_ENDPOINT}/paginated?${params.toString()}`);
  },

  /**
   * Obtiene un departamento por su clave (ID).
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    return api.get(`${DEPARTAMENTOS_ENDPOINT}/${id}`);
  },

  /**
   * Crea un nuevo departamento.
   * @param {object} departamentoData - Datos del departamento a crear.
   * @returns {Promise<Object>}
   */
  create: async (departamentoData) => {
    return api.post(DEPARTAMENTOS_ENDPOINT, departamentoData);
  },

  /**
   * Actualiza un departamento existente.
   * @param {number} id 
   * @param {object} departamentoData - Datos del departamento a actualizar.
   * @returns {Promise<Object>}
   */
  update: async (id, departamentoData) => {
    return api.put(`${DEPARTAMENTOS_ENDPOINT}/${id}`, departamentoData);
  },

  /**
   * Elimina un departamento.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    return api.delete(`${DEPARTAMENTOS_ENDPOINT}/${id}`);
  },

};
