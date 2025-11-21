const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');

exports.getAllClasificaciones = async () => {
    try {
        const dasificacions = await QueryHandler.execute('SELECT * FROM ma_clasif', [], 'main');
        return dasificacions;
    } catch (error) {
        Logger.error(`Error fetching dasificacions: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getClasificacionByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_clasif WHERE clave = ?';
        const dasificacions = await QueryHandler.execute(sql, [cve], 'main');
        return dasificacions;
    } catch (error) {
        Logger.error(`Error fetching dasificacions by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateClasificacion = async (cve, updateData) => {
    try {
        let sql = 'UPDATE ma_clasif SET ';
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

        const updatedEepartamento = await QueryHandler.execute('SELECT * FROM ma_clasif WHERE clave = ?', [cve], 'main');
        return updatedEepartamento[0];
    } catch (error) {
        Logger.error(`Error updating dasificacion: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setClasificacion = async (clasificacionData) => {
    try {
        let sql = 'INSERT INTO ma_clasif (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in clasificacionData) {
            fields.push(key);
            placeholders.push('?');
            params.push(clasificacionData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newClasificacion = await QueryHandler.execute('SELECT * FROM ma_clasif WHERE clave = ?', [result.insertId], 'main');
        return newClasificacion[0];
    } catch (error) {
        Logger.error(`Error inserting clasificacion: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}