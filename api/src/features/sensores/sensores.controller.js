const sensoresService = require('./sensores.service');
const sensoresLecturasService = require('./sensores_lecturas.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');

/**
 * Obtiene el estatus de todos los sensores para el dashboard.
 */
exports.getDashboardStatus = asyncHandler(async (req, res) => {
    // Pasar el ID del usuario autenticado para filtrar permisos
    const statusData = await sensoresService.getDashboardStatus(req.user.clave);
    
    if (!statusData || statusData.length === 0) {
        throw new NotFoundError('No se encontraron sensores con permiso de consulta');
    }
    
    res.status(200).json(statusData);
});

/**
 * Fuerza una actualización manual de un sensor enviando una señal por socket.
 */
exports.refreshSensor = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const sent = await sensoresLecturasService.refreshSensor(name);
    
    if (!sent) {
        throw new NotFoundError('El sensor no se encuentra conectado al servidor TCP');
    }
    
    res.status(200).json({ success: true, message: 'Señal de refresco enviada' });
});

/**
 * Obtiene todos los sensores básicos.
 */
exports.getAllSensores = asyncHandler(async (req, res) => {
    const sensores = await sensoresService.getAllSensores();
    res.status(200).json(sensores);
});
