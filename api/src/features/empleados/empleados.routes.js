const express = require('express');
const router = express.Router();

const { getAllEmpleados, getEmpleadoByCve, updateEmpleado, setEmpleado } = require('./empleados.controller');

router.get('/', getAllEmpleados);

router.get('/:cve', getEmpleadoByCve);

router.put('/:cve', updateEmpleado);

router.post('/', setEmpleado);

module.exports = router;