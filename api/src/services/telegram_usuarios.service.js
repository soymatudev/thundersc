const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');

exports.setTelegramUsuario = async (UsuarioData) => {
    try {
        let existingUser = await this.getTelegramUsuarioByCve(UsuarioData.clave);

        if (existingUser.length > 0) {
            Logger.info(`User with clave ${UsuarioData.clave} already exists.`);
            return existingUser[0];
        }

        let sql = 'INSERT INTO ma_chatids (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in UsuarioData) {
            fields.push(key);
            placeholders.push('?');
            params.push(UsuarioData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newAlmacen = await QueryHandler.execute('SELECT * FROM ma_chatids WHERE clave = ?', [result.insertId], 'main');
        return newAlmacen[0];
    } catch (error) {
        Logger.error(`Error creating usuario telegram: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getTelegramUsuarios = async () => {
    try {
        const usuarios = await QueryHandler.execute('SELECT * FROM ma_chatids', [], 'main');
        return usuarios;
    } catch (error) {
        Logger.error(`Error fetching usuarios: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getTelegramUsuarioByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_chatids WHERE clave = ?';
        const usuarios = await QueryHandler.execute(sql, [cve], 'main');
        return usuarios;
    } catch (error) {
        Logger.error(`Error fetching usuarios by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setTelegramUsuarioxSensor = async (UsuarioData) => {
    try {
        const existingUser = await this.getTelegramUsuariosxSensor(UsuarioData);
        if (existingUser.length > 0) {
            Logger.info(`Usuario sensor with cve_usu ${UsuarioData.cve_usu} and cve_ses ${UsuarioData.cve_ses} already exists.`);
            return null;
        }
        let sql = 'INSERT INTO ma_sesus (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in UsuarioData) {
            fields.push(key);
            placeholders.push('?');
            params.push(UsuarioData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' +placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newUsuario = await QueryHandler.execute('SELECT * FROM ma_sesus WHERE cve_usu = ?', [result.insertId], 'main');
        return newUsuario[0];
    } catch (error) {
        Logger.error(`Error creating usuario sensor: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getTelegramUsuariosxSensor = async (UsuarioData) => {
    try {
        params = [UsuarioData.cve_usu, UsuarioData.cve_ses];
        const usuarios = await QueryHandler.execute('SELECT * FROM ma_sesus where cve_usu = ? and cve_ses = ?', params, 'main');
        Logger.info(`Fetched usuarios sensores with params: ${params}`);
        Logger.info(`Result: ${JSON.stringify(usuarios)}`);
        return usuarios;
    } catch (error) {
        Logger.error(`Error fetching usuarios sensores: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Obtiene todos los Chat IDs de Telegram suscritos a las alertas de un sensor específico.
 * 
 * @param {array} infoSensor - El nombre o identificador del sensor (ej. 'Temp02').
 * @returns {Promise<string[]>} - Una promesa que resuelve a un array de strings, donde cada string es un chat_id.
 */
exports.getChatIdsPorSensor = async (infoSensor) => {
    const query = 'SELECT cve_usu as chat_id FROM ma_sesus WHERE cve_ses = ? and cns_sn = ?';
    const params = [infoSensor.clave, "S"];
    try {
        Logger.info(`Buscando suscriptores para el sensor: ${infoSensor.alias}`);
        const results = await QueryHandler.execute(query, params);
        if (!results || results.length === 0) {
            Logger.warn(`No se encontraron suscriptores de Telegram para el sensor: ${infoSensor.alias}`);
            return [];
        }
        const chatIds = results.map(row => row.chat_id.trim());
        Logger.info(`Suscriptores encontrados para ${infoSensor.alias}: ${chatIds.join(', ')}`);
        return chatIds;
    } catch (error) {
        Logger.error(`Error al obtener los Chat IDs para el sensor ${infoSensor.alias}: ${error.message}`);
        return [];
    }
};
