const express = require('express');
const router = express.Router();

const { getAllMarcas, getMarcaByCve, updateMarca, setMarca } = require('./marcas.controller');

router.get('/', getAllMarcas);

router.get('/:cve', getMarcaByCve);

router.put('/:cve', updateMarca);

router.post('/', setMarca);

module.exports = router;