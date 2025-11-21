const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');

exports.getAllEmpleados = async () => {
    try {
        const empleados = await QueryHandler.execute('SELECT * FROM ma_emple', [], 'main');
        return empleados;
    } catch (error) {
        Logger.error(`Error fetching empleados: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEmpleadoByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_emple WHERE id = ?';
        const empleados = await QueryHandler.execute(sql, [cve], 'main');
        return empleados;
    } catch (error) {
        Logger.error(`Error fetching empleados by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateEmpleado = async (cve, updateData) => {
    try {
        let sql = 'UPDATE ma_emple SET ';
        const params = [];
        const updates = [];

        for (const key in updateData) {
            updates.push(`${key} = ?`);
            params.push(updateData[key]);
        }

        sql += updates.join(', ') + ' WHERE id = ?';
        params.push(cve);

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        if (result.affectedRows === 0) return null;

        const updatedEmpleado = await QueryHandler.execute('SELECT * FROM ma_emple WHERE id = ?', [cve], 'main');
        return updatedEmpleado[0];
    } catch (error) {
        Logger.error(`Error updating empleado: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setEmpleado = async (empleadoData) => {
    try {
        let sql = 'INSERT INTO ma_emple (';
        const params = [];
        const fields = [];
        const placeholders = [];

        for (const key in empleadoData) {
            fields.push(key);
            placeholders.push('?');
            params.push(empleadoData[key]);
        }

        sql += fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';

        Logger.info(`Executing SQL: ${sql} with params: ${params}`);
        const result = await QueryHandler.execute(sql, params, 'main');

        const newEmpleado = await QueryHandler.execute('SELECT * FROM ma_emple WHERE id = ?', [result.insertId], 'main');
        return newEmpleado[0];
    } catch (error) {
        Logger.error(`Error inserting empleado: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}