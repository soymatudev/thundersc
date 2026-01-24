const Logger = require('../../shared/utils/Logger');
const marcasService = require('./marcas.service');
const { json } = require('express');

exports.getAllMarcas = async (req, res) => {
    try {
        const marcas = await marcasService.getAllMarcas();
        if (marcas.length === 0) return res.status(404).json({ message: 'No marcas found' });
        res.status(200).json(marcas);
    } catch (error) {
        Logger.error(`Error fetching marcas: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getMarcasPaginadas = async (req, res) => {
    try {
        const { page, pageSize, descri } = req.query;

        if (!page && !pageSize && !descri) {
            const marcas = await marcasService.getAllMarcas();
            if (marcas.length === 0) return res.status(404).json({ message: 'No marcas found' });
            return res.status(200).json(marcas);
        }
        const pageNum = parseInt(page, 10) || 1;
        const pageSizeNum = parseInt(pageSize, 10) || 10;
        const result = await marcasService.getMarcasPaginadas(pageNum, pageSizeNum, descri);

        if (result.marcas.length === 0) {
            return res.status(404).json({ message: 'No marcas found for the given criteria' });
        }
        res.status(200).json(result);
    } catch (error) {
        Logger.error(`Error fetching marcas: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getMarcaByCve = async (req, res) => {
    const { cve } = req.params;
    try {
        const marcas = await marcasService.getMarcaByCve(cve);
        if (marcas.length === 0) return res.status(404).json({ message: 'No marcas found for the given cve' });
        res.status(200).json(marcas);
    } catch (error) {
        Logger.error(`Error fetching marcas by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateMarca = async (req, res) => {
    const { cve } = req.params;
    const updateData = req.body;
    try {
        const updatedMarca = await marcasService.updateMarca(cve, updateData);
        if (!updatedMarca) return res.status(404).json({ message: 'Marca not found' });
        res.status(200).json(updatedMarca);
    } catch (error) {
        Logger.error(`Error updating almacen: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.setMarca = async (req, res) => {
    const marcaData = req.body;
    try {
        const newMarca = await marcasService.setMarca(marcaData);
        res.status(201).json(newMarca);
    } catch (error) {
        Logger.error(`Error creating marca: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteMarca = async (req, res) => {
    const { cve } = req.params;
    try {
        const deletedMarca = await marcasService.deleteMarca(cve);
        if (!deletedMarca) return res.status(404).json({ message: 'Marca not found' });
        res.status(200).json({ message: 'Marca deleted successfully' });
    } catch (error) {
        Logger.error(`Error deleting marca: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}