const QueryHandler = require('../utils/QueryHandler');
const Logger = require('../utils/Logger');

exports.getAllSensores = async () => {
    try {
        const sql = 'SELECT a.*, b.descri as unidad FROM ma_equipo a, ma_unidad b where a.cve_unidad = b.clave';
        const sensores = await QueryHandler.execute(sql, [], 'main');
        return sensores;
    } catch (error) {
        Logger.error(`Error fetching sensores: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getSensorByCve = async (cve) => {
    try {
        let sql = 'SELECT * FROM ma_equipo WHERE clave = ?';
        const sensores = await QueryHandler.execute(sql, [cve], 'main');
        return sensores;
    } catch (error) {
        Logger.error(`Error fetching sensores by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getSensorByName = async (name) => {
    try {
        let sql = 'SELECT * FROM ma_equipo WHERE nombre = ?';
        const sensores = await QueryHandler.execute(sql, [name], 'main');
        return sensores[0];
    } catch (error) {
        Logger.error(`Error fetching sensores by name: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}
