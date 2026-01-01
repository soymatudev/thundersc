const Logger = require('../../shared/utils/Logger');
const movimientosService = require('./movimientos.service');

exports.getMovimientosByCodigoEquipo = async (req, res) => {
    try {
        const { cod_inv } = req.params;
        Logger.info('Inventory report request received');
        const result = await movimientosService.getMovimientosByCodigoEquipo(cod_inv);
        res.json(result);
    } catch (error) {
        Logger.error(`Controller error on getMovimientosByCodigoEquipo: ${error.message}`);
        res.status(500).json({ message: 'Error al generar el reporte de inventario.' });
    }
};

exports.createMovimiento = async (req, res) => {
    try {
        const movimientoData = req.body;
        const newMovimiento = await movimientosService.createMovimiento(movimientoData);
        res.status(201).json(newMovimiento);
    } catch (error) {
        Logger.error(`Controller error on createMovimiento: ${error.message}`);
        res.status(500).json({ message: 'Error al crear el movimiento.' });
    }
}