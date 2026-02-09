const express = require('express');
const router = express.Router();
const { getBackupsStatus } = require('./backups.controller');

router.get('/', getBackupsStatus);

module.exports = router;
