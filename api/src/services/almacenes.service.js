const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');


exports.getAllAlmacenes = async () => {
    try {
        const almacenes = await QueryHandler.execute('SELECT * FROM ma_almac', [], 'main');
        return almacenes;
    } catch (error) {
        Logger.error(`Error fetching almacenes: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAlmacenesByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_almac WHERE clave = ?';
        const almacenes = await QueryHandler.execute(sql, [cve], 'main');
        return almacenes;
    } catch (error) {
        Logger.error(`Error fetching almacenes by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateAlmacen = async (cve, updateData) => {
    try {
        let sql = 'UPDATE ma_almac SET ';
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

        const updatedAlmacen = await QueryHandler.execute('SELECT * FROM ma_almac WHERE clave = ?', [cve], 'main');
        return updatedAlmacen[0];
    } catch (error) {
        Logger.error(`Error updating almacen: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setAlmacen = async (almacenData) => {
    try {
        let sql = 'INSERT INTO ma_almac (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in almacenData) {
            fields.push(key);
            placeholders.push('?');
            params.push(almacenData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newAlmacen = await QueryHandler.execute('SELECT * FROM ma_almac WHERE clave = ?', [result.insertId], 'main');
        return newAlmacen[0];
    } catch (error) {
        Logger.error(`Error creating almacen: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}