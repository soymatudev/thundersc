import { api } from '../../../shared/services/ApiClient';

const BACKUPS_ENDPOINT = '/backups';

export const BackupsService = {
    getStatus: async () => {
        return api.get(BACKUPS_ENDPOINT);
    }
};
