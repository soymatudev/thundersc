import { api } from '../../../shared/services/ApiClient';

const CLASIFICACIONES_ENDPOINT = '/clasificaciones_equipos';

export const ClasificacionesService = {
  
  /**
   * Obtiene todas las clasificaciones.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    return api.get(CLASIFICACIONES_ENDPOINT);
  },
};
