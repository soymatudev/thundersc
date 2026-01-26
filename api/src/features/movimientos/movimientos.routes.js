const express = require('express');
const router = express.Router();
const movimientosController = require('./movimientos.controller');
const authMiddleware = require('../../shared/middleware/auth.middleware');

// Protect all movement routes
router.use(authMiddleware);

router.get('/buscar/:cod_inv', movimientosController.getEquipoWithLocation);

router.post('/', movimientosController.createMovimiento);

module.exports = router;
