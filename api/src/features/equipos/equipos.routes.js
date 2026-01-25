const express = require('express');
const router = express.Router();

const { getAllEquipos, getEquipoByCve, updateEquipo, setEquipo, getEquipoBySerie, createMassiveEquipos, getFolioByClasif } = require('./equipos.controller');

router.get('/', getAllEquipos);

router.get('/serie/:serie', getEquipoBySerie);

router.get('/:cve', getEquipoByCve);

router.put('/:cve', updateEquipo);

router.post('/', setEquipo);

router.post('/entrada-masiva', createMassiveEquipos);

router.get('/folios/:cve_clasif', getFolioByClasif);

module.exports = router;