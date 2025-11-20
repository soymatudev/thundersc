const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');


exports.getAllEquipos = async () => {
    try {
        const equipos = await QueryHandler.execute('SELECT * FROM ma_eqsis', [], 'main');
        return equipos;
    } catch (error) {
        Logger.error(`Error fetching equipos: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEquipoByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_eqsis WHERE clave = ?';
        const equipos = await QueryHandler.execute(sql, [cve], 'main');
        return equipos;
    } catch (error) {
        Logger.error(`Error fetching equipos by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateEquipo = async (cve, updateData) => {
    try {
        let sql = 'UPDATE ma_eqsis SET ';
        const params = [];
        const updates = [];

        for (const key in updateData) {
            updates.push(`${key} = ?`);
            params.push(updateData[key]);
        }

        sql += updates.join(', ') + ' WHERE clave = ?';
        params.push(cve);

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        if (result.affectedRows === 0) return null;

        const updatedEquipo = await QueryHandler.execute('SELECT * FROM ma_eqsis WHERE clave = ?', [cve], 'main');
        return updatedEquipo[0];
    } catch (error) {
        Logger.error(`Error updating equipo: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setEquipo = async (equipoData) => {
    try {
        let sql = 'INSERT INTO ma_eqsis (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in equipoData) {
            fields.push(key);
            placeholders.push('?');
            params.push(equipoData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newEquipo = await QueryHandler.execute('SELECT * FROM ma_eqsis WHERE clave = ?', [result.insertId], 'main');
        return newEquipo[0];
    } catch (error) {
        Logger.error(`Error inserting equipo: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}