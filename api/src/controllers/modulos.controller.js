const Logger = require('../utils/Logger');
const modulosService = require('../services/modulos.service');

exports.setModulo = async (req, res) => {
    const {moduloData, permisoModuloData} = req.body;
    try {
        const newModulo = await modulosService.setModulo(moduloData, permisoModuloData);
        res.status(201).json(newModulo);
    } catch (error) {
        Logger.error(`Error creating modulo: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllModulos = async (req, res) => {
    try {
        const modulos = await modulosService.getAllModulos();
        if (modulos.length === 0) return res.status(404).json({ message: 'No modulos found' });
        res.status(200).json(modulos);
    } catch (error) {
        Logger.error(`Error fetching modulos: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getModuloByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const modulo = await modulosService.getModuloByCve(cve);
        if (!modulo) return res.status(404).json({ message: 'No modulo found for the given cve' });
        res.status(200).json(modulo);
    } catch (error) {
        Logger.error(`Error fetching modulo by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateModulo = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedModulo = await modulosService.updateModulo(cve, updateData);
        if (!updatedModulo) return res.status(404).json({ message: 'Modulo not found' });
        res.status(200).json(updatedModulo);
    } catch (error) {
        Logger.error(`Error updating modulo: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}