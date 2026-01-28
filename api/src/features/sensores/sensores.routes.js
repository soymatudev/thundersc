const express = require('express');
const router = express.Router();
const authMiddleware = require('../../shared/middleware/auth.middleware');
const { 
    getDashboardStatus, 
    getAllSensores, 
    refreshSensor, 
    getHistorico, 
    getReporte,
    createSensor,
    updateSensor,
    deleteSensor,
    getUnidades,
    getZonas
} = require('./sensores.controller');



// All sensor routes are protected
router.use(authMiddleware);

// Catalogs
router.get('/unidades', getUnidades);
router.get('/zonas', getZonas);

// Main dashboard endpoint for polling
router.get('/dashboard', getDashboardStatus);

// CRUD
router.get('/all', getAllSensores);
router.post('/', createSensor);
router.put('/:clave', updateSensor);
router.delete('/:clave', deleteSensor);

// Force refresh signal to physical sensor
router.post('/refresh/:name', refreshSensor);

// Historico
router.get('/historico', getHistorico);

// Reporte para Grid
router.get('/reporte', getReporte);




module.exports = router;
