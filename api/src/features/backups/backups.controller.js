const backupsService = require('./backups.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

exports.getBackupsStatus = asyncHandler(async (req, res) => {
    const status = await backupsService.getBackupsStatus();
    res.status(200).json(status);
});
