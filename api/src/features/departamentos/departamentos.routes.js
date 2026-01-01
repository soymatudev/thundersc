const express = require('express');
const router = express.Router();

const { getAllDepartamentos, getDepartamentosPaginados, getDepartamentoByCve, updateDepartamento, setDepartamento, deleteDepartamento } = require('./departamentos.controller');

router.get('/', getAllDepartamentos);

router.get('/paginated', getDepartamentosPaginados);

router.get('/:cve', getDepartamentoByCve);

router.put('/:cve', updateDepartamento);

router.post('/', setDepartamento);

router.delete('/:cve', deleteDepartamento);

module.exports = router;