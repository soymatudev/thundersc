const viajesService = require('./viajes.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllViajes = asyncHandler(async (req, res) => {
    const viajes = await viajesService.getAllViajes();
    if (!viajes || viajes.length === 0) {
        throw new NotFoundError('No se encontraron viajes');
    }
    res.status(200).json(viajes);
});

exports.getViajesPaginadas = asyncHandler(async (req, res) => {
    const { page, pageSize, destino } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;

    const result = await viajesService.getViajesPaginadas(pageNum, pageSizeNum, destino);

    if (!result || result.viajes.length === 0) {
        throw new NotFoundError('No se encontraron viajes para los criterios dados');
    }
    res.status(200).json(result);
});

exports.getViajeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const viaje = await viajesService.getViajeById(id);
    res.status(200).json(viaje);
});

exports.getViajeByEmpleado = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const viaje = await viajesService.getViajeByEmpleado(id);
    res.status(200).json(viaje);
});

exports.updateViaje = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedViaje = await viajesService.updateViaje(id, updateData);
    res.status(200).json(updatedViaje);
});

exports.setViaje = asyncHandler(async (req, res) => {
    const viajeData = req.body;
    const newViaje = await viajesService.setViaje(viajeData);
    res.status(201).json(newViaje);
});

exports.uploadEvidencia = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ ok: false, msg: 'No se subió ningún archivo' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/viaticos/${req.file.filename}`;

    res.status(201).json({
        ok: true,
        url: fileUrl
    });
});

exports.deleteViaje = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await viajesService.deleteViaje(id);
    res.status(200).json({ message: 'Viaje desactivado correctamente' });
});