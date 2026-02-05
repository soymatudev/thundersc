const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../../shared/middleware/upload.middleware');

const { getAllViajes, getViajesAdmin, getViajesPaginadas, getViajeById, getViajeByEmpleado, downloadViaje, updateViaje, setViaje, uploadEvidencia, deleteViaje } = require('./viajes.controller');

router.get('/', getAllViajes);

router.get('/detallado', getViajesAdmin);

router.get('/paginated', getViajesPaginadas);

router.get('/:id', getViajeById);

router.get('/:id', getViajeByEmpleado);

router.get('/download/:id', downloadViaje);

router.put('/:id', updateViaje);

router.post('/', setViaje);

router.post('/upload', uploadMiddleware.array('files', 5), uploadEvidencia);

router.delete('/:id', deleteViaje);

module.exports = router;