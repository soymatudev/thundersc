const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');

exports.getAllDepartamentos = async () => {
    try {
        const departamentos = await QueryHandler.execute('SELECT * FROM ma_depar', [], 'main');
        return departamentos;
    } catch (error) {
        Logger.error(`Error fetching departamentos: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getDepartamentoByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_depar WHERE clave = ?';
        const departamentos = await QueryHandler.execute(sql, [cve], 'main');
        return departamentos;
    } catch (error) {
        Logger.error(`Error fetching departamentos by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateDepartamento = async (cve, updateData) => {
    try {
        let sql = 'UPDATE ma_depar SET ';
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

        const updatedEepartamento = await QueryHandler.execute('SELECT * FROM ma_depar WHERE clave = ?', [cve], 'main');
        return updatedEepartamento[0];
    } catch (error) {
        Logger.error(`Error updating departamento: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setDepartamento = async (departamentoData) => {
    try {
        let sql = 'INSERT INTO ma_depar (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in departamentoData) {
            fields.push(key);
            placeholders.push('?');
            params.push(departamentoData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newDepartamento = await QueryHandler.execute('SELECT * FROM ma_depar WHERE clave = ?', [result.insertId], 'main');
        return newDepartamento[0];
    } catch (error) {
        Logger.error(`Error inserting departamento: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}