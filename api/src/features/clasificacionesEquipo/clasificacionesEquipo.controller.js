const Logger = require('../../shared/utils/Logger');
const clasificacionsService = require('./clasificacionesEquipo.service');
const { json } = require('express');

exports.getAllClasificaciones = async (req, res) => {
    try {
        const clasificacions = await clasificacionsService.getAllClasificaciones();
        if (clasificacions.length === 0) return res.status(404).json({ message: 'No clasificacions found' });
        res.status(200).json(clasificacions);
    } catch (error) {
        Logger.error(`Error fetching clasificacions: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getClasificacionByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const clasificacions = await clasificacionsService.getClasificacionByCve(cve);
        if (clasificacions.length === 0) return res.status(404).json({ message: 'No clasificacions found for the given cve' });
        res.status(200).json(clasificacions);
    } catch (error) {
        Logger.error(`Error fetching clasificacions by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateClasificacion = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedClasificacion = await clasificacionsService.updateClasificacion(cve, updateData);
        if (!updatedClasificacion) return res.status(404).json({ message: 'Clasificacion not found' });
        res.status(200).json(updatedClasificacion);
    } catch (error) {
        Logger.error(`Error updating clasificacion: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setClasificacion = async (req, res) => {
    const clasificacionData = req.body;
    try {
        const newClasificacion = await clasificacionsService.setClasificacion(clasificacionData);
        res.status(201).json(newClasificacion);
    } catch (error) {
        Logger.error(`Error creating clasificacion: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}