const Logger = require('../../shared/utils/Logger');
const departamentosService = require('./departamentos.service');

exports.getDepartamentosPaginados = async (req, res) => {
    try {
        Logger.info('Cargando departamentos en pages');
        const { page, pageSize, descri } = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const pageSizeNum = parseInt(pageSize, 10) || 20;

        const result = await departamentosService.getDepartamentosPaginados(pageNum, pageSizeNum, descri);

        // Si se pidió una página específica y no hay resultados, pero sí hay total, tal vez sea una página vacía, 
        // pero devolvemos 200 con array vacío para que el front lo maneje.
        // Solo 404 si NO hay nada en absoluto en la DB para ese filtro? 
        // El patrón de almacenes devuelve 404 si result.almacenes.length === 0, vamos a seguirlo.
        if (result.departamentos.length === 0 && result.pagination.total === 0) {
             return res.status(404).json({ message: 'No departamentos found for the given criteria' });
        }
        
        res.status(200).json(result);
    } catch (error) {
        Logger.error(`Error fetching paginated departamentos: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllDepartamentos = async (req, res) => {
    try {

        Logger.info('Cargando departamentos en pages');
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

exports.deleteDepartamento = async (req, res) => {
    const { cve } = req.params;
    try {
        const deletedDepartamento = await departamentosService.deleteDepartamento(cve);
        res.status(200).json({ message: 'Departamento deleted successfully', departamento: deletedDepartamento });
    } catch (error) {
        Logger.error(`Error deleting departamento: ${error.message}`);
        if (error.message === 'Departamento not found') {
            return res.status(404).json({ message: 'Departamento not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}