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
  }
};
