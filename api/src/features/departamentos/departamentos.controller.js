const departamentosService = require('./departamentos.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getDepartamentosPaginados = asyncHandler(async (req, res) => {
    const { page, pageSize, descri } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 20;

    const result = await departamentosService.getDepartamentosPaginados(pageNum, pageSizeNum, descri);

    if (result.departamentos.length === 0 && result.pagination.total === 0) {
        throw new NotFoundError('No se encontraron departamentos para los criterios dados');
    }

    res.status(200).json(result);
});

exports.getAllDepartamentos = asyncHandler(async (req, res) => {
    const departamentos = await departamentosService.getAllDepartamentos();
    if (!departamentos || departamentos.length === 0) {
        throw new NotFoundError('No se encontraron departamentos');
    }
    res.status(200).json(departamentos);
});

exports.getDepartamentoByCve = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const departamento = await departamentosService.getDepartamentoByCve(cve);
    res.status(200).json(departamento);
});

exports.updateDepartamento = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    const updatedDepartamento = await departamentosService.updateDepartamento(cve, updateData);
    res.status(200).json(updatedDepartamento);
});

exports.setDepartamento = asyncHandler(async (req, res) => {
    const departamentoData = req.body;
    const newDepartamento = await departamentosService.setDepartamento(departamentoData);
    res.status(201).json(newDepartamento);
});

exports.deleteDepartamento = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const deletedDepartamento = await departamentosService.deleteDepartamento(cve);
    res.status(200).json({ message: 'Departamento eliminado correctamente', departamento: deletedDepartamento });
});