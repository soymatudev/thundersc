const Logger = require('../../shared/utils/Logger');
const empresasService = require('./empresas.service');

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

exports.getEmpresasPaginadas = async (req, res) => {
    try {
        const { page, pageSize, nombre } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const pageSizeNum = parseInt(pageSize, 10) || 10;

        const result = await empresasService.getEmpresasPaginadas(pageNum, pageSizeNum, nombre);

        if (result.empresas.length === 0) {
            return res.status(404).json({ message: 'No empresas found for the given criteria' });
        }
        res.status(200).json(result);
    } catch (error) {
        Logger.error(`Error fetching paginated empresas: ${error.message}`);
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

exports.deleteEmpresa = async (req, res) => {
    const { cve } = req.params;
    try {
        const deletedEmpresa = await empresasService.deleteEmpresa(cve);
        if (!deletedEmpresa) return res.status(404).json({ message: 'Empresa not found' });
        res.status(200).json({ message: 'Empresa deleted successfully' });
    } catch (error) {
        Logger.error(`Error deleting empresa: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}