const marcasService = require('./marcas.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllMarcas = asyncHandler(async (req, res) => {
    const marcas = await marcasService.getAllMarcas();
    if (!marcas || marcas.length === 0) throw new NotFoundError('No se encontraron marcas');
    res.status(200).json(marcas);
});

exports.getMarcasPaginadas = asyncHandler(async (req, res) => {
    const { page, pageSize, descri } = req.query;

    if (!page && !pageSize && !descri) {
        const marcas = await marcasService.getAllMarcas();
        if (!marcas || marcas.length === 0) throw new NotFoundError('No se encontraron marcas');
        return res.status(200).json(marcas);
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;
    const result = await marcasService.getMarcasPaginadas(pageNum, pageSizeNum, descri);

    if (!result || result.marcas.length === 0) {
        throw new NotFoundError('No se encontraron marcas para los criterios dados');
    }
    res.status(200).json(result);
});

exports.getMarcaByCve = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const marca = await marcasService.getMarcaByCve(cve);
    if (!marca) throw new NotFoundError('No se encontró marca para la clave proporcionada');
    res.status(200).json(marca);
});

exports.updateMarca = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    const updatedMarca = await marcasService.updateMarca(cve, updateData);
    res.status(200).json(updatedMarca);
});

exports.setMarca = asyncHandler(async (req, res) => {
    const marcaData = req.body;
    const newMarca = await marcasService.setMarca(marcaData);
    res.status(201).json(newMarca);
});

exports.deleteMarca = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    await marcasService.deleteMarca(cve);
    res.status(200).json({ message: 'Marca eliminada correctamente' });
});