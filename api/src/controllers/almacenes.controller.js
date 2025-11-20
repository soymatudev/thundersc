const Logger = require('../utils/Logger');
const almacenesService = require('../services/almacenes.service');
const { json } = require('express');

exports.getAllAlmacenes = async (req, res) => {
    try {
        const almacenes = await almacenesService.getAllAlmacenes();
        if (almacenes.length === 0) return res.status(404).json({ message: 'No almacenes found' });
        res.status(200).json(almacenes);
    } catch (error) {
        Logger.error(`Error fetching almacenes: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAlmacenesByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const almacenes = await almacenesService.getAlmacenesByCve(cve);
        if (almacenes.length === 0) return res.status(404).json({ message: 'No almacenes found for the given cve' });
        res.status(200).json(almacenes);
    } catch (error) {
        Logger.error(`Error fetching almacenes by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateAlmacen = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedAlmacen = await almacenesService.updateAlmacen(cve, updateData);
        if (!updatedAlmacen) return res.status(404).json({ message: 'Almacen not found' });
        res.status(200).json(updatedAlmacen);
    } catch (error) {
        Logger.error(`Error updating almacen: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setAlmacen = async (req, res) => {
    const almacenData = req.body;
    try {
        const newAlmacen = await almacenesService.setAlmacen(almacenData);
        res.status(201).json(newAlmacen);
    } catch (error) {
        Logger.error(`Error creating almacen: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}