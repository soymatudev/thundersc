const express = require('express');
const router = express.Router();
const authMiddleware = require('../../shared/middleware/auth.middleware');
const { getDashboardStatus, getAllSensores, refreshSensor, getHistorico, getReporte } = require('./sensores.controller');



// All sensor routes are protected
router.use(authMiddleware);

// Main dashboard endpoint for polling
router.get('/dashboard', getDashboardStatus);

// Force refresh signal to physical sensor
router.post('/refresh/:name', refreshSensor);

// Basic CRUD/Listings
router.get('/all', getAllSensores);

// Historico
router.get('/historico', getHistorico);

// Reporte para Grid
router.get('/reporte', getReporte);



module.exports = router;
