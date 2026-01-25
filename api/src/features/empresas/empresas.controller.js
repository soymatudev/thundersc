const empresasService = require('./empresas.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllEmpresas = asyncHandler(async (req, res) => {
    const empresas = await empresasService.getAllEmpresas();
    if (!empresas || empresas.length === 0) {
        throw new NotFoundError('No se encontraron empresas');
    }
    res.status(200).json(empresas);
});

exports.getEmpresasPaginadas = asyncHandler(async (req, res) => {
    const { page, pageSize, nombre } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;

    const result = await empresasService.getEmpresasPaginadas(pageNum, pageSizeNum, nombre);

    if (!result || result.empresas.length === 0) {
        throw new NotFoundError('No se encontraron empresas para los criterios dados');
    }
    res.status(200).json(result);
});

exports.getEmpresaByCve = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const empresa = await empresasService.getEmpresaByCve(cve);
    res.status(200).json(empresa);
});

exports.updateEmpresa = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    const updatedEmpresa = await empresasService.updateEmpresa(cve, updateData);
    res.status(200).json(updatedEmpresa);
});

exports.setEmpresa = asyncHandler(async (req, res) => {
    const empresaData = req.body;
    const newEmpresa = await empresasService.setEmpresa(empresaData);
    res.status(201).json(newEmpresa);
});

exports.deleteEmpresa = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    await empresasService.deleteEmpresa(cve);
    res.status(200).json({ message: 'Empresa desactivada correctamente' });
});