const Logger = require('../../shared/utils/Logger');
const movimientosService = require('./movimientos.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

exports.getEquipoWithLocation = asyncHandler(async (req, res) => {
    const { cod_inv } = req.params;
    const result = await movimientosService.getEquipoWithLocation(cod_inv);
    res.json(result);
});

exports.createMovimiento = asyncHandler(async (req, res) => {
    const movementData = req.body;
    // Inject current user for audit if needed, though ma_eqasis doesn't have it in schema yet
    // we use it for business logic if necessary
    const result = await movimientosService.executeMovement({
        ...movementData,
        cve_usu_act: req.user?.clave
    });
    res.status(201).json(result);
});