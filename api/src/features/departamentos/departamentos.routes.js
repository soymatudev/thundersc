const express = require('express');
const router = express.Router();

const { getAllDepartamentos, getDepartamentoByCve, updateDepartamento, setDepartamento } = require('./departamentos.controller');

router.get('/', getAllDepartamentos);

router.get('/:cve', getDepartamentoByCve);

router.put('/:cve', updateDepartamento);

router.post('/', setDepartamento);

module.exports = router;