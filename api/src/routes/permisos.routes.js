const express = require('express');
const router = express.Router();

const { getAllPermisos, getPermisoByCve, updatePermiso, setPermiso } = require('../controllers/permisos.controller');

router.get('/', getAllPermisos);

router.get('/:cve', getPermisoByCve);

router.put('/:cve', updatePermiso);

router.post('/', setPermiso);

module.exports = router;