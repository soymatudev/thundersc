const consultasService = require('./consultas.service');
const Logger = require('../../shared/utils/Logger');

exports.getInventarioPorEquipo = async (req, res) => {
    try {
        Logger.info('Inventory report request received');
        const result = await consultasService.getInventarioPorEquipo(req.query);
        res.json(result);
    } catch (error) {
        Logger.error(`Controller error on getInventarioPorEquipo: ${error.message}`);
        res.status(500).json({ message: 'Error al generar el reporte de inventario.' });
    }
};

exports.getIngresosPorEquipo = async (req, res) => {
    try {
        Logger.info('Employee by department report request received');
        const result = await consultasService.getIngresosPorEquipo(req.query);
        res.json(result);
    } catch (error) {
        Logger.error(`Controller error on getIngresosPorEquipo: ${error.message}`);
        res.status(500).json({ message: 'Error al generar el reporte de empleados por departamento.' });
    }
};

exports.getReporteBackups = async (req, res) => {
    try {
        Logger.info('DB backups report request received');
        const result = await consultasService.generarReporteBackups();
        res.json(result);
    } catch (error) {
        Logger.error(`Controller error on getReporteBackups: ${error.message}`);
        res.status(500).json({ message: 'Error al generar el reporte de backups.' });
    }
};
