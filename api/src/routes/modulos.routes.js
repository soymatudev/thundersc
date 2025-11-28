const express = require('express');
const router = express.Router();

const { setModulo, getAllModulos, getModuloByCve, updateModulo } = require('../controllers/modulos.controller');

router.get('/', getAllModulos);

router.get('/:cve', getModuloByCve);

router.put('/:cve', updateModulo);

router.post('/', setModulo);

module.exports = router;