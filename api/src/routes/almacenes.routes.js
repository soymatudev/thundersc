const express = require('express');
const router = express.Router();

const { getAllAlmacenes, getAlmacenesByCve, updateAlmacen, setAlmacen } = require('../controllers/almacenes.controller');

router.get('/', getAllAlmacenes);

router.get('/:cve', getAlmacenesByCve);

router.put('/:cve', updateAlmacen);

router.post('/', setAlmacen);

module.exports = router;