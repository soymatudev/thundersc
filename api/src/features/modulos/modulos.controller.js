const Logger = require('../../shared/utils/Logger');
const modulosService = require('./modulos.service');

exports.getAllModulos = async (req, res) => {
    try {
        const { page, pageSize, term } = req.query;

        // Si se envían parámetros de paginación, usamos la función paginada
        if (page || pageSize || term) {
            const pageNum = parseInt(page, 10) || 1;
            const pageSizeNum = parseInt(pageSize, 10) || 20;
            const result = await modulosService.getModulosPaginados(pageNum, pageSizeNum, term);
            
            if (result.modulos.length === 0 && result.pagination.total === 0) {
                 return res.status(404).json({ message: 'No modules found for the given criteria' });
            }
            return res.status(200).json(result);
        }

        // Fallback a getAll si no hay paginación (útil si se usa en otros lados sin paginar)
        const modulos = await modulosService.getAllModulos();
        res.status(200).json(modulos);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createModulo = async (req, res) => {
    try {
        const newModulo = await modulosService.createModulo(req.body);
        res.status(201).json(newModulo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateModulo = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedModulo = await modulosService.updateModulo(id, req.body);
        res.status(200).json(updatedModulo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteModulo = async (req, res) => {
    const { id } = req.params;
    try {
        await modulosService.deleteModulo(id);
        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};