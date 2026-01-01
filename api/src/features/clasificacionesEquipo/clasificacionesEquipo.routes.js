const express = require('express');
const router = express.Router();

const { getAllClasificaciones, getClasificacionByCve, updateClasificacion, setClasificacion } = require('./clasificacionesEquipo.controller');

router.get('/', getAllClasificaciones);

router.get('/:cve', getClasificacionByCve);

router.put('/:cve', updateClasificacion);

router.post('/', setClasificacion);

module.exports = router;