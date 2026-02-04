const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../../shared/middleware/upload.middleware');

const { getAllViajes, getViajesPaginadas, getViajeById, getViajeByEmpleado, updateViaje, setViaje, uploadEvidencia, deleteViaje } = require('./viajes.controller');

router.get('/', getAllViajes);

router.get('/paginated', getViajesPaginadas);

router.get('/:id', getViajeById);

router.get('/:id', getViajeByEmpleado);

router.put('/:id', updateViaje);

router.post('/', setViaje);

router.post('/upload', uploadMiddleware.single('file'), uploadEvidencia);

router.delete('/:id', deleteViaje);

module.exports = router;