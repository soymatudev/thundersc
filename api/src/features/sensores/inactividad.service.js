const { prisma } = require('../../shared/config/prismaClient');
const Logger = require('../../shared/utils/Logger');
const telegramService = require('../telegram/telegram.service');
const dayjs = require('dayjs');

// In-memory set to track sensors that have already been alerted
// To avoid spamming alerts
const alertedSensors = new Set();

/**
 * Checks all sensors for inactivity (> 60 minutes) 
 * and sends a Telegram alert if necessary.
 */
exports.checkSensorsInactivity = async () => {
    try {
        Logger.info('Iniciando verificación de inactividad de sensores...');
        
        // 1. Obtener todos los equipos activos
        const sensores = await prisma.ma_equipo.findMany({
            select: {
                clave: true,
                alias: true,
                nombre: true
            }
        });

        const now = dayjs();

        for (const sensor of sensores) {
            // 2. Buscar el último registro para este sensor
            const ultimoRegistro = await prisma.ma_regzoro.findFirst({
                where: { cve_equipo: BigInt(sensor.clave) },
                orderBy: { fecha_hora: 'desc' }
            });

            if (!ultimoRegistro) {
                Logger.debug(`Sensor ${sensor.alias} no tiene registros previos.`);
                continue;
            }

            // Aplicar corrección de zona horaria (mismo ajuste que en dashboard)
            const fechaUltimo = dayjs(ultimoRegistro.fecha_hora).add(new Date().getTimezoneOffset(), 'minute');
            const diffMinutos = now.diff(fechaUltimo, 'minute');

            if (diffMinutos > 60) {
                // El sensor está fuera de línea
                if (!alertedSensors.has(sensor.clave)) {
                    // No se ha enviado alerta aún
                    const horasSilencio = (diffMinutos / 60).toFixed(1);
                    const mensaje = `⚠️ SENSOR FUERA DE LÍNEA ⚠️\n\n` +
                                    `Sensor: ${sensor.alias || sensor.nombre}\n` +
                                    `Último reporte: ${fechaUltimo.format('YYYY-MM-DD HH:mm:ss')}\n` +
                                    `Tiempo en silencio: ${horasSilencio} horas.`;

                    Logger.warn(`Sensor ${sensor.alias} inactivo por ${horasSilencio}h. Enviando alerta.`);
                    
                    // Enviar alerta
                    await telegramService.enviarAlerta(sensor, mensaje);
                    
                    // Marcar como alertado
                    alertedSensors.add(sensor.clave);
                }
            } else {
                // El sensor está reportando correctamente, resetear alerta si existía
                if (alertedSensors.has(sensor.clave)) {
                    Logger.info(`Sensor ${sensor.alias} ha vuelto a la normalidad.`);
                    alertedSensors.delete(sensor.clave);
                }
            }
        }
    } catch (error) {
        Logger.error(`Error en checkSensorsInactivity: ${error.message}`);
    }
};

/**
 * Resetea el estado de alerta para un sensor específico.
 * Se llama cuando llega una nueva lectura.
 * @param {number} cve_equipo 
 */
exports.resetAlert = (cve_equipo) => {
    const clave = Number(cve_equipo);
    if (alertedSensors.has(clave)) {
        Logger.info(`Reseteando alerta de inactividad para sensor ID: ${clave} por nueva lectura.`);
        alertedSensors.delete(clave);
    }
};
