const express = require('express');
const router = express.Router();

const { getAllEmpleados, getEmpleadosPaginados, getEmpleadoByCve, updateEmpleado, setEmpleado, deleteEmpleado } = require('./empleados.controller');

router.get('/all', getAllEmpleados);

router.get('/', getEmpleadosPaginados);

router.get('/:cve', getEmpleadoByCve);

router.put('/:cve', updateEmpleado);

router.post('/', setEmpleado);

router.delete('/:cve', deleteEmpleado);

module.exports = router;