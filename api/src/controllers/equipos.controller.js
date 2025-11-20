const Logger = require('../utils/Logger');
const equiposService = require('../services/equipos.service');
const { json } = require('express');

exports.getAllEquipos = async (req, res) => {
    try {
        const equipos = await equiposService.getAllEquipos();
        if (equipos.length === 0) return res.status(404).json({ message: 'No equipos found' });
        res.status(200).json(equipos);
    } catch (error) {
        Logger.error(`Error fetching equipos: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEquipoByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const equipos = await equiposService.getEquipoByCve(cve);
        if (equipos.length === 0) return res.status(404).json({ message: 'No equipos found for the given cve' });
        res.status(200).json(equipos);
    } catch (error) {
        Logger.error(`Error fetching equipos by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateEquipo = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedEquipo = await equiposService.updateEquipo(cve, updateData);
        if (!updatedEquipo) return res.status(404).json({ message: 'Equipo not found' });
        res.status(200).json(updatedEquipo);
    } catch (error) {
        Logger.error(`Error updating equipo: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setEquipo = async (req, res) => {
    const equipoData = req.body;
    try {
        const newEquipo = await equiposService.setEquipo(equipoData);
        res.status(201).json(newEquipo);
    } catch (error) {
        Logger.error(`Error creating equipo: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}