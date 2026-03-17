const express = require('express');
const router = express.Router();

const { 
    getAllClasificaciones,
    getClasificacionesPaginadas, 
    getClasificacionByCve, 
    updateClasificacion, 
    setClasificacion,
    deleteClasificacion 
} = require('./clasificacionesEquipo.controller');

router.get('/', getClasificacionesPaginadas);
router.get('/all', getAllClasificaciones);
router.get('/:cve', getClasificacionByCve);
router.put('/:cve', updateClasificacion);
router.post('/', setClasificacion);
router.delete('/:cve', deleteClasificacion);

module.exports = router;