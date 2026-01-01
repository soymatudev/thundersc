const express = require('express');
const router = express.Router();

const { getAllEquipos, getEquipoByCve, updateEquipo, setEquipo } = require('./equipos.controller');

router.get('/', getAllEquipos);

router.get('/:cve', getEquipoByCve);

router.put('/:cve', updateEquipo);

router.post('/', setEquipo);

module.exports = router;