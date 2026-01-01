const express = require('express');
const router = express.Router();

// Import feature routes
const almacenesRouter = require('./features/almacenes/almacenes.routes');
const marcasRouter = require('./features/marcas/marcas.routes');
const equiposRouter = require('./features/equipos/equipos.routes');
const empleadosRouter = require('./features/empleados/empleados.routes');
const departamentosRouter = require('./features/departamentos/departamentos.routes');
const clasificacionesEquiposRouter = require('./features/clasificacionesEquipo/clasificacionesEquipo.routes');
const consultasRouter = require('./features/consultas/consultas.routes');
const movimientosRouter = require('./features/movimientos/movimientos.routes');
const authRouter = require('./features/auth/auth.routes');
const healthRouter = require('./features/health/health.routes');
const modulosRouter = require('./features/modulos/modulos.routes');
const empresasRouter = require('./features/empresas/empresas.routes');

// Use feature routes
router.use('/modulos', modulosRouter);
router.use('/almacenes', almacenesRouter);
router.use('/marcas', marcasRouter);
router.use('/equipos', equiposRouter);
router.use('/empleados', empleadosRouter);
router.use('/departamentos', departamentosRouter);
router.use('/clasificaciones_equipos', clasificacionesEquiposRouter);
router.use('/consultas', consultasRouter);
router.use('/movimientos', movimientosRouter);
router.use('/empresas', empresasRouter);
router.use('/auth', authRouter);
router.use('/health', healthRouter);

module.exports = router;
