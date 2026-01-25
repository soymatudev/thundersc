const modulosService = require('./modulos.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getModulosPaginados = asyncHandler(async (req, res) => {
    const { page, pageSize, term } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 20;

    const result = await modulosService.getModulosPaginados(pageNum, pageSizeNum, term);
    
    if (result.modulos.length === 0 && result.pagination.total === 0) {
        throw new NotFoundError('No se encontraron módulos para los criterios dados');
    }
    res.status(200).json(result);
});

exports.getAllModulos = asyncHandler(async (req, res) => {
    const modulos = await modulosService.getAllModulos();
    if (!modulos || modulos.length === 0) {
        throw new NotFoundError('No se encontraron módulos');
    }
    res.status(200).json(modulos);
});

exports.createModulo = asyncHandler(async (req, res) => {
    const newModulo = await modulosService.createModulo(req.body);
    res.status(201).json(newModulo);
});

exports.updateModulo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedModulo = await modulosService.updateModulo(id, req.body);
    res.status(200).json(updatedModulo);
});

exports.deleteModulo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await modulosService.deleteModulo(id);
    res.status(200).json({ message: 'Módulo eliminado correctamente' });
});