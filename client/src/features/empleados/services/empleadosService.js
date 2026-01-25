import { api } from '../../../shared/services/ApiClient';

const EMPLEADOS_ENDPOINT = '/empleados';

export const EmpleadosService = {
  
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    //if (filters.depar) params.append('depar', filters.depar);
    //if (filters.status !== undefined) params.append('status', filters.status);
    
    return api.get(`${EMPLEADOS_ENDPOINT}/all?${params.toString()}`);
  },

  getPaginated: async (page, pageSize, nombre) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (nombre) params.append('nombre', nombre);
    
    const url = `${EMPLEADOS_ENDPOINT}?${params.toString()}`;
    return api.get(url);
  },

  getById: async (id) => {
    return api.get(`${EMPLEADOS_ENDPOINT}/${id}`);
  },

  create: async (empleadoData) => {
    return api.post(EMPLEADOS_ENDPOINT, empleadoData);
  },

  update: async (id, empleadoData) => {
    return api.put(`${EMPLEADOS_ENDPOINT}/${id}`, empleadoData);
  },

  delete: async (id) => {
    return api.delete(`${EMPLEADOS_ENDPOINT}/${id}`);
  },

};
