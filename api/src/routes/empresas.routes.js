const express = require('express');
const router = express.Router();

const { getAllEmpresas, getEmpresaByCve, updateEmpresa, setEmpresa } = require('../controllers/empresas.controller');

router.get('/', getAllEmpresas);

router.get('/:cve', getEmpresaByCve);

router.put('/:cve', updateEmpresa);

router.post('/', setEmpresa);

module.exports = router;