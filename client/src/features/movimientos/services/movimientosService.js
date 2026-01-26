import { api } from '../../../shared/services/ApiClient';

const MOVIMIENTOS_ENDPOINT = '/movimientos';

export const MovimientosService = {
  /**
   * Busca un equipo y su ubicación actual por código de inventario.
   */
  buscarEquipo: async (codInv) => {
    return api.get(`${MOVIMIENTOS_ENDPOINT}/buscar/${codInv}`);
  },

  /**
   * Crea un nuevo movimiento de inventario.
   * @param {Object} data { cve_eqsis, cve_emple, cve_depar, cve_alm, new_status }
   */
  crearMovimiento: async (data) => {
    return api.post(MOVIMIENTOS_ENDPOINT, data);
  }
};
