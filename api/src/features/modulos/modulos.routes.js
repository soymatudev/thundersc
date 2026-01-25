const express = require('express');
const router = express.Router();
const { getModulosPaginados, getAllModulos, createModulo, updateModulo, deleteModulo } = require('./modulos.controller');

// Main route for paginated/filtered results
router.get('/', getModulosPaginados);

// Route to get all modules without pagination
router.get('/all', getAllModulos);

router.post('/', createModulo);
router.put('/:id', updateModulo);
router.delete('/:id', deleteModulo);

module.exports = router;