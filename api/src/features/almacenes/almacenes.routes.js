const express = require('express');
const router = express.Router();

const { getAlmacenesPaginados, getAllAlmacenes, getAlmacenesByCve, updateAlmacen, setAlmacen, deleteAlmacen } = require('./almacenes.controller');

router.get('/', getAllAlmacenes);

router.get('/paginated', getAlmacenesPaginados);

router.get('/:cve', getAlmacenesByCve);

router.put('/:cve', updateAlmacen);

router.put('/delete/:cve', deleteAlmacen);

router.post('/', setAlmacen);

module.exports = router;