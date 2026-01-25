const empleadosService = require('./empleados.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllEmpleados = asyncHandler(async (req, res) => {
    const filters = req.query;
    const empleados = await empleadosService.getAllEmpleados(filters);
    if (!empleados || empleados.length === 0) {
        throw new NotFoundError('No se encontraron empleados');
    }
    res.status(200).json(empleados);
});

exports.getEmpleadosPaginados = asyncHandler(async (req, res) => {
    const { page, pageSize, nombre } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;

    const result = await empleadosService.getEmpleadosPaginados(pageNum, pageSizeNum, nombre);

    if (!result || result.empleados.length === 0) {
        throw new NotFoundError('No se encontraron empleados para los criterios dados');
    }
    res.status(200).json(result);
});

exports.getEmpleadoByCve = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const empleado = await empleadosService.getEmpleadoByCve(cve);
    res.status(200).json(empleado);
});

exports.updateEmpleado = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    const updatedEmpleado = await empleadosService.updateEmpleado(cve, updateData);
    res.status(200).json(updatedEmpleado);
});

exports.setEmpleado = asyncHandler(async (req, res) => {
    const empleadoData = req.body;
    const newEmpleado = await empleadosService.setEmpleado(empleadoData);
    res.status(201).json(newEmpleado);
});

exports.deleteEmpleado = asyncHandler(async (req, res) => {
    const { cve } = req.params;
    await empleadosService.deleteEmpleado(cve);
    res.status(200).json({ message: 'Empleado desactivado correctamente' });
});