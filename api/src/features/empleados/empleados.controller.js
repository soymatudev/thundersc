const Logger = require('../../shared/utils/Logger');
const empleadosService = require('./empleados.service');
const { json } = require('express');

exports.getAllEmpleados = async (req, res) => {
    try {
        const empleados = await empleadosService.getAllEmpleados();
        if (empleados.length === 0) return res.status(404).json({ message: 'No empleados found' });
        res.status(200).json(empleados);
    } catch (error) {
        Logger.error(`Error fetching empleados: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEmpleadoByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const empleados = await empleadosService.getEmpleadoByCve(cve);
        if (empleados.length === 0) return res.status(404).json({ message: 'No empleados found for the given cve' });
        res.status(200).json(empleados);
    } catch (error) {
        Logger.error(`Error fetching empleados by cve: ${error.message}`);
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