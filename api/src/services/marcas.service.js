const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');


exports.getAllMarcas = async () => {
    try {
        const marcas = await QueryHandler.execute('SELECT * FROM ma_marca', [], 'main');
        return marcas;
    } catch (error) {
        Logger.error(`Error fetching marcas: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getMarcaByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_marca WHERE clave = ?';
        const marcas = await QueryHandler.execute(sql, [cve], 'main');
        return marcas;
    } catch (error) {
        Logger.error(`Error fetching marcas by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateMarca = async (cve, updateData) => {
    try {
        let sql = 'UPDATE ma_marca SET ';
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

        const updatedMarca = await QueryHandler.execute('SELECT * FROM ma_marca WHERE clave = ?', [cve], 'main');
        return updatedMarca[0];
    } catch (error) {
        Logger.error(`Error updating marca: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setMarca = async (marcaData) => {
    try {
        let sql = 'INSERT INTO ma_marca (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in marcaData) {
            fields.push(key);
            placeholders.push('?');
            params.push(marcaData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newMarca = await QueryHandler.execute('SELECT * FROM ma_marca WHERE clave = ?', [result.insertId], 'main');
        return newMarca[0];
    } catch (error) {
        Logger.error(`Error creating marca: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}