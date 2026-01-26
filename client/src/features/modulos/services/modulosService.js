import { api } from '../../../shared/services/ApiClient';

const MODULOS_ENDPOINT = '/modulos';

export const ModulosService = {
  getAll: async () => {
    return api.get(`${MODULOS_ENDPOINT}/all`);
  },

  getPaginated: async (page = 1, pageSize = 20, term = '') => {
    const params = new URLSearchParams({
        page,
        pageSize,
        term
    });
    return api.get(`${MODULOS_ENDPOINT}?${params.toString()}`);
  },

  create: async (moduloData) => {
    return api.post(MODULOS_ENDPOINT, moduloData);
  },

  update: async (id, moduloData) => {
    return api.put(`${MODULOS_ENDPOINT}/${id}`, moduloData);
  },

  delete: async (id) => {
    return api.delete(`${MODULOS_ENDPOINT}/${id}`);
  },
};
