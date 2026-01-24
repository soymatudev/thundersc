const Logger = require('../../shared/utils/Logger');
const empleadosService = require('./empleados.service');
const { json } = require('express');

exports.getAllEmpleados = async (req, res) => {
    try {
        const empleados = await empleadosService.getAllEmpleados();
        res.status(200).json(empleados);
    } catch (error) {
        Logger.error(`Error fetching all empleados: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEmpleadosPaginados = async (req, res) => {
    try {
        const { page, pageSize, nombre } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const pageSizeNum = parseInt(pageSize, 10) || 10;

        Logger.info(`Fetching empleados - Page: ${pageNum}, Page Size: ${pageSizeNum}, Nombre Filter: ${nombre || 'None'}`);
        const result = await empleadosService.getEmpleadosPaginados(pageNum, pageSizeNum, nombre);

        if (result.empleados.length === 0) {
            return res.status(404).json({ message: 'No empleados found for the given criteria' });
        }
        res.status(200).json(result);
    } catch (error) {
        Logger.error(`Error fetching paginated empleados: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEmpleadoByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const empleado = await empleadosService.getEmpleadoByCve(cve);
        if (!empleado) return res.status(404).json({ message: 'No empleado found for the given cve' });
        res.status(200).json(empleado);
    } catch (error) {
        Logger.error(`Error fetching empleado by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateEmpleado = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedEmpleado = await empleadosService.updateEmpleado(cve, updateData);
        if (!updatedEmpleado) return res.status(404).json({ message: 'Empleado not found' });
        res.status(200).json(updatedEmpleado);
    } catch (error) {
        Logger.error(`Error updating empleado: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setEmpleado = async (req, res) => {
    const empleadoData = req.body;
    try {
        const newEmpleado = await empleadosService.setEmpleado(empleadoData);
        res.status(201).json(newEmpleado);
    } catch (error) {
        Logger.error(`Error creating empleado: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteEmpleado = async (req, res) => {
    const { cve } = req.params;
    try {
        const deletedEmpleado = await empleadosService.deleteEmpleado(cve);
        if (!deletedEmpleado) return res.status(404).json({ message: 'Empleado not found' });
        res.status(200).json({ message: 'Empleado deleted successfully' });
    } catch (error) {
        Logger.error(`Error deleting empleado: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}