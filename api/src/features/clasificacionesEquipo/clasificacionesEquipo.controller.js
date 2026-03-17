const clasificacionsService = require('./clasificacionesEquipo.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllClasificaciones = asyncHandler(async (req, res) => {
    const clasificacions = await clasificacionsService.getAllClasificaciones();
    if (!clasificacions || clasificacions.length === 0) throw new NotFoundError('No se encontraron clasificaciones');
    res.status(200).json(clasificacions);
});

exports.getClasificacionesPaginadas = asyncHandler(async (req, res) => {
    const { page, pageSize, descri } = req.query;

    if (!page && !pageSize && !descri) {
        const clasificacions = await clasificacionsService.getAllClasificaciones();
        if (!clasificacions || clasificacions.length === 0) throw new NotFoundError('No se encontraron clasificaciones');
        return res.status(200).json(clasificacions);
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;
    const result = await clasificacionsService.getClasificacionesPaginadas(pageNum, pageSizeNum, descri);

    if (!result || result.clasificaciones.length === 0) {
        throw new NotFoundError('No se encontraron clasificaciones para los criterios dados');
    }
    res.status(200).json(result);
});

exports.getClasificacionByCve = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const clasificacion = await clasificacionsService.getClasificacionByCve(cve);
    res.status(200).json(clasificacion);
});

exports.updateClasificacion = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    const updatedClasificacion = await clasificacionsService.updateClasificacion(cve, updateData);
    res.status(200).json(updatedClasificacion);
});

exports.setClasificacion = asyncHandler(async (req, res) => {
    const clasificacionData = req.body;
    const newClasificacion = await clasificacionsService.setClasificacion(clasificacionData);
    res.status(201).json(newClasificacion);
});

exports.deleteClasificacion = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    await clasificacionsService.deleteClasificacion(cve);
    res.status(200).json({ message: 'Clasificación eliminada correctamente' });
});