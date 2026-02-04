import { api } from '../../../shared/services/ApiClient';

const VIAJES_ENDPOINT = '/viajes';

export const ViajesService = {
  
  getDetallado: async () => {
    return api.get(`${VIAJES_ENDPOINT}/detallado`);
  },

  getById: async (id) => {
    return api.get(`${VIAJES_ENDPOINT}/${id}`);
  },

  update: async (id, viajeData) => {
    return api.put(`${VIAJES_ENDPOINT}/${id}`, viajeData);
  },

  delete: async (id) => {
    return api.delete(`${VIAJES_ENDPOINT}/${id}`);
  },

};
