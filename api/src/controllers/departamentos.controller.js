const Logger = require('../utils/Logger');
const departamentosService = require('../services/departamentos.service');
const { json } = require('express');

exports.getAllDepartamentos = async (req, res) => {
    try {
        const departamentos = await departamentosService.getAllDepartamentos();
        if (departamentos.length === 0) return res.status(404).json({ message: 'No departamentos found' });
        res.status(200).json(departamentos);
    } catch (error) {
        Logger.error(`Error fetching departamentos: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getDepartamentoByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const departamentos = await departamentosService.getDepartamentoByCve(cve);
        if (departamentos.length === 0) return res.status(404).json({ message: 'No departamentos found for the given cve' });
        res.status(200).json(departamentos);
    } catch (error) {
        Logger.error(`Error fetching departamentos by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateDepartamento = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedDepartamento = await departamentosService.updateDepartamento(cve, updateData);
        if (!updatedDepartamento) return res.status(404).json({ message: 'Departamento not found' });
        res.status(200).json(updatedDepartamento);
    } catch (error) {
        Logger.error(`Error updating departamento: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setDepartamento = async (req, res) => {
    const departamentoData = req.body;
    try {
        const newDepartamento = await departamentosService.setDepartamento(departamentoData);
        res.status(201).json(newDepartamento);
    } catch (error) {
        Logger.error(`Error creating departamento: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}