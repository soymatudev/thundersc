const Logger = require('../utils/Logger');
const empresasService = require('../services/empresas.service');

exports.getAllEmpresas = async (req, res) => {
    try {
        const empresas = await empresasService.getAllEmpresas();
        if (empresas.length === 0) return res.status(404).json({ message: 'No empresas found' });
        res.status(200).json(empresas);
    } catch (error) {
        Logger.error(`Error fetching empresas: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEmpresaByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const empresa = await empresasService.getEmpresaByCve(cve);
        if (!empresa) return res.status(404).json({ message: 'No empresa found for the given cve' });
        res.status(200).json(empresa);
    } catch (error) {
        Logger.error(`Error fetching empresa by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateEmpresa = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedEmpresa = await empresasService.updateEmpresa(cve, updateData);
        if (!updatedEmpresa) return res.status(404).json({ message: 'Empresa not found' });
        res.status(200).json(updatedEmpresa);
    } catch (error) {
        Logger.error(`Error updating empresa: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setEmpresa = async (req, res) => {
    const empresaData = req.body;
    try {
        const newEmpresa = await empresasService.setEmpresa(empresaData);
        res.status(201).json(newEmpresa);
    } catch (error) {
        Logger.error(`Error creating empresa: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}