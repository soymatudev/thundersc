const express = require('express');
const router = express.Router();
const movimientosController = require('./movimientos.controller');

router.get('/:cod_inv', movimientosController.getMovimientosByCodigoEquipo);

router.post('/', movimientosController.createMovimiento);

module.exports = router;
