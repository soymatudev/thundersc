import { api } from '../../../shared/services/ApiClient';

const SENSORES_ENDPOINT = '/sensores';

export const SensoresService = {
  getDashboard: async () => {
    return api.get(`${SENSORES_ENDPOINT}/dashboard`);
  },

  getAll: async () => {
    return api.get(`${SENSORES_ENDPOINT}/all`);
  },

  refreshSensor: async (sensorName) => {
    return api.post(`${SENSORES_ENDPOINT}/refresh/${sensorName}`);
  },

  getHistory: async (startDate, endDate, cveEquipo) => {
    const params = {
      fecha_inicio: startDate,
      fecha_fin: endDate,
      cve_equipo: cveEquipo
    };
    const queryString = new URLSearchParams(params).toString();
    return api.get(`${SENSORES_ENDPOINT}/historico?${queryString}`);
  },

  getReporte: async (filters, pagination) => {
    const params = {
      ...filters,
      ...pagination
    };
    const queryString = new URLSearchParams(params).toString();
    return api.get(`${SENSORES_ENDPOINT}/reporte?${queryString}`);
  },

  create: async (data) => {
    return api.post(SENSORES_ENDPOINT, data);
  },

  update: async (clave, data) => {
    return api.put(`${SENSORES_ENDPOINT}/${clave}`, data);
  },

  delete: async (clave) => {
    return api.delete(`${SENSORES_ENDPOINT}/${clave}`);
  },

  getUnidades: async () => {
    return api.get(`${SENSORES_ENDPOINT}/unidades`);
  },

  getZonas: async () => {
    return api.get(`${SENSORES_ENDPOINT}/zonas`);
  }
};


