const almacenesService = require('./almacenes.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAlmacenesPaginados = asyncHandler(async (req, res) => {
    const { page, pageSize, descri } = req.query;

    if (!page && !pageSize && !descri) {
        const almacenes = await almacenesService.getAllAlmacenes();
        if (!almacenes || almacenes.length === 0) throw new NotFoundError('No se encontraron almacenes');
        return res.status(200).json(almacenes);
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 20;
    const result = await almacenesService.getAlmacenesPaginados(pageNum, pageSizeNum, descri);

    if (!result || result.almacenes.length === 0) {
        throw new NotFoundError('No se encontraron almacenes para los criterios dados');
    }
    res.status(200).json(result);
});

exports.getAllAlmacenes = asyncHandler(async (req, res) => {
    const almacenes = await almacenesService.getAllAlmacenes();
    if (!almacenes || almacenes.length === 0) throw new NotFoundError('No se encontraron almacenes');
    res.status(200).json(almacenes);
});

exports.getAlmacenesByCve = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const almacen = await almacenesService.getAlmacenesByCve(cve);
    res.status(200).json(almacen);
});

exports.updateAlmacen = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    const updatedAlmacen = await almacenesService.updateAlmacen(cve, updateData);
    res.status(200).json(updatedAlmacen);
});

exports.setAlmacen = asyncHandler(async (req, res) => {
    const almacenData = req.body;
    const newAlmacen = await almacenesService.setAlmacen(almacenData);
    res.status(201).json(newAlmacen);
});

exports.deleteAlmacen = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    await almacenesService.deleteAlmacen(cve);
    res.status(200).json({ message: 'Almacén desactivado correctamente' });
});