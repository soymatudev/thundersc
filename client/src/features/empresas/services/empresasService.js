import { api } from '../../../shared/services/ApiClient';

const EMPRESAS_ENDPOINT = '/empresas';

export const EmpresasService = {
  
  getAll: async () => {
    return api.get(EMPRESAS_ENDPOINT);
  },

  getPaginated: async (page, pageSize, nombre) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (nombre) params.append('nombre', nombre);
    
    const url = `${EMPRESAS_ENDPOINT}/paginated?${params.toString()}`;
    return api.get(url);
  },

  getById: async (id) => {
    return api.get(`${EMPRESAS_ENDPOINT}/${id}`);
  },

  create: async (empresaData) => {
    return api.post(EMPRESAS_ENDPOINT, empresaData);
  },

  update: async (id, empresaData) => {
    return api.put(`${EMPRESAS_ENDPOINT}/${id}`, empresaData);
  },

  delete: async (id) => {
    return api.delete(`${EMPRESAS_ENDPOINT}/${id}`);
  },

};
