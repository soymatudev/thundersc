const equiposService = require('./equipos.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllEquipos = asyncHandler(async (req, res) => {
    const equipos = await equiposService.getAllEquipos();
    if (!equipos || equipos.length === 0) {
        throw new NotFoundError('No se encontraron equipos');
    }
    res.status(200).json(equipos);
});

exports.getEquipoByCve = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const equipo = await equiposService.getEquipoByCve(cve);
    res.status(200).json(equipo);
});

exports.getEquipoBySerie = asyncHandler(async (req, res) => {
    const { serie } = req.params;
    const equipos = await equiposService.getEquipoBySerie(serie);
    if (!equipos || equipos.length === 0) {
        throw new NotFoundError(`No se encontró equipo con la serie ${serie}`);
    }
    res.status(200).json(equipos);
});

exports.updateEquipo = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    const updatedEquipo = await equiposService.updateEquipo(cve, updateData);
    res.status(200).json(updatedEquipo);
});

exports.setEquipo = asyncHandler(async (req, res) => {
    const equipoData = req.body;
    const newEquipo = await equiposService.setEquipo(equipoData);
    res.status(201).json(newEquipo);
});

exports.createMassiveEquipos = asyncHandler(async (req, res) => {
    const equiposData = req.body;
    const newEquipos = await equiposService.createMassiveEquipos(equiposData);
    res.status(201).json(newEquipos);
});

exports.getFolioByClasif = asyncHandler(async (req, res) => {
    const { cve_clasif } = req.params;
    const folio = await equiposService.getFolioByClasif(cve_clasif);
    res.status(200).json(folio);
});

exports.getReporte = asyncHandler(async (req, res) => {
    const filters = req.body;
    const report = await equiposService.getReporte(filters);
    res.status(200).json(report);
});