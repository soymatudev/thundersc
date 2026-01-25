const express = require('express');
const router = express.Router();

const { getAllMarcas, getMarcaByCve, updateMarca, setMarca, deleteMarca, getMarcasPaginadas } = require('./marcas.controller');

router.get('/all', getAllMarcas);

router.get('/:cve', getMarcaByCve);

router.get('/', getMarcasPaginadas);

router.put('/:cve', updateMarca);

router.post('/', setMarca);

router.delete('/:cve', deleteMarca);

module.exports = router;