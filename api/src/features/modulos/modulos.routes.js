const express = require('express');
const router = express.Router();
const { getAllModulos, createModulo, updateModulo, deleteModulo } = require('./modulos.controller');

router.get('/', getAllModulos);
router.post('/', createModulo);
router.put('/:id', updateModulo);
router.delete('/:id', deleteModulo);

module.exports = router;