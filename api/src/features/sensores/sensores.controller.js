const sensoresService = require('./sensores.service');
const sensoresLecturasService = require('./sensores_lecturas.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { NotFoundError } = require('../../shared/utils/CustomError');
const dayjs = require('dayjs');

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
    const data = await sensoresService.getAllSensores();
    res.status(200).json(data);
});

/**
 * Crea un sensor.
 */
exports.createSensor = asyncHandler(async (req, res) => {
    const sensor = await sensoresService.createSensor(req.body);
    res.status(201).json(sensor);
});

/**
 * Actualiza un sensor.
 */
exports.updateSensor = asyncHandler(async (req, res) => {
    const { clave } = req.params;
    const sensor = await sensoresService.updateSensor(clave, req.body);
    res.status(200).json(sensor);
});

/**
 * Elimina un sensor.
 */
exports.deleteSensor = asyncHandler(async (req, res) => {
    const { clave } = req.params;
    await sensoresService.deleteSensor(clave);
    res.status(204).send();
});

/**
 * Obtiene catálogo de unidades.
 */
exports.getUnidades = asyncHandler(async (req, res) => {
    const data = await sensoresService.getUnidades();
    res.status(200).json(data);
});

/**
 * Obtiene catálogo de zonas.
 */
exports.getZonas = asyncHandler(async (req, res) => {
    const data = await sensoresService.getZonas();
    res.status(200).json(data);
});


/**
 * Obtiene el historial de sensores.
 */
exports.getHistorico = asyncHandler(async (req, res) => {
    let { fecha_inicio, fecha_fin, cve_equipo } = req.query;

    if (!fecha_inicio || !fecha_fin) {
        throw new Error('Parámetros fecha_inicio y fecha_fin son requeridos');
    }

    const start = dayjs(fecha_inicio).format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs(fecha_fin).format('YYYY-MM-DD HH:mm:ss');

    const data = await sensoresService.getHistory(start, end, cve_equipo ? parseInt(cve_equipo) : undefined);
    res.status(200).json(data);
});

/**
 * Obtiene el reporte de sensores para el Grid.
 */
exports.getReporte = asyncHandler(async (req, res) => {
    const { fecha_inicio, fecha_fin, cve_equipos, skip, take } = req.query;

    if (!fecha_inicio || !fecha_fin) {
        throw new Error('Parámetros fecha_inicio y fecha_fin son requeridos');
    }

    // cve_equipos can be a comma-separated string or an array from query
    let equiposArray = [];
    if (cve_equipos) {
        equiposArray = Array.isArray(cve_equipos) ? cve_equipos : cve_equipos.split(',');
    }

    const result = await sensoresService.getReportData(
        { 
            fecha_inicio, 
            fecha_fin, 
            cve_equipos: equiposArray.length > 0 ? equiposArray.map(id => parseInt(id)) : undefined 
        },
        { 
            skip: skip ? parseInt(skip) : 0, 
            take: take ? parseInt(take) : 100 
        }
    );

    res.status(200).json(result);
});


