const express = require('express');
const router = express.Router();

const { getAllEmpresas, getEmpresasPaginadas, getEmpresaByCve, updateEmpresa, setEmpresa, deleteEmpresa } = require('./empresas.controller');

router.get('/', getAllEmpresas);

router.get('/paginated', getEmpresasPaginadas);

router.get('/:cve', getEmpresaByCve);

router.put('/:cve', updateEmpresa);

router.post('/', setEmpresa);

router.delete('/:cve', deleteEmpresa);

module.exports = router;