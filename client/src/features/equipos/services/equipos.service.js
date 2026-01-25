import { api } from '../../../shared/services/ApiClient.js';

const EQUIPOS_ENDPOINT = '/equipos';

export const getEquipoBySerie = async (serie) => {
    return api.get(`${EQUIPOS_ENDPOINT}/serie/${serie}`);
}

export const createMassiveEquipos = async (data) => {
    return api.post(`${EQUIPOS_ENDPOINT}/entrada-masiva`, data);
}

export const getFolio = async (cve_clasif) => {
    return api.get(`${EQUIPOS_ENDPOINT}/folios/${cve_clasif}`);
}
