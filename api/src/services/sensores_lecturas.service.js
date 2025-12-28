const prisma = require('../config/prismaClient');
const Logger = require('../utils/Logger');
const telegramService = require('./telegram.service');
const { getSensorByName } = require('./sensores.service');

/**
 * Procesa y registra la lectura de un sensor.
 * @param {object} data - El objeto de datos parseado desde el socket.
 */
exports.registrarLectura = async (data) => {
    Logger.info('Procesando datos del sensor', data);

    if (data.type === 'temperature') {
        Logger.info(`Procesando evento de temperatura para el sensor: ${data.sensorName}`);
        await eventTemperatura(data);
    }

    if (data.type === 'generic_event') {
        if (data.eventType === 'NEG') {
            await eventNeg(data);
        } else if (data.eventType === 'DIS') {
            await eventDis(data);
        }
    }

    return { success: true, message: 'Datos procesados' };
};

const eventTemperatura = async (data) => {
    const infoSensor = await getSensorByName(data.sensorName);
    if (!infoSensor) {
        Logger.error(`No se encontró el sensor con nombre: ${data.sensorName}`);
        return null;
    }
    
    alertaTemperatura(data, infoSensor);
    
    return prisma.ma_regzoro.create({
        data: {
            cve_equipo: BigInt(infoSensor.clave),
            fecha_hora: new Date(),
            dato_1: data.dato_1.toString(),
            dato_2: data.dato_2.toString(),
            dato_3: '0',
        }
    });
}

const alertaTemperatura = (data, infoSensor) => {
    try {
        const umbralInferior = parseFloat(infoSensor.adc_3);
        const umbralSuperior = parseFloat(infoSensor.adc_1);
        if (data.dato_1 >= umbralSuperior || data.dato_1 <= umbralInferior) {
            const mensaje = `🌡️ ¡Alerta de Temperatura! 🌡️\nSensor: ${infoSensor.alias}\nTemperatura actual: ${data.dato_1}°C`;
            Logger.warn(mensaje);
            telegramService.enviarAlerta(infoSensor, mensaje);
        }
    } catch (error) {
        Logger.error(`Error en alertaTemperatura: ${error.message}`);
    }
}

const eventNeg = async (data) => {
    const infoSensor = await getSensorByName(data.sensorName);
    if (!infoSensor) {
        Logger.error(`No se encontró el sensor con nombre: ${data.sensorName}`);
        return;
    }
    const mensaje = `\n ⚡ Alerta de Energia! ⚡\n 📟 Sensor: ${infoSensor.alias} fuera de servicio o sin energia`
    Logger.warn(mensaje);
    telegramService.enviarAlerta(infoSensor, mensaje);
}

const eventDis = async (data) => {
    const infoSensor = await getSensorByName(data.sensorName);
    if (!infoSensor) {
        Logger.error(`No se encontró el sensor con nombre: ${data.sensorName}`);
        return null;
    }

    alertaDis(data, infoSensor);
    
    return prisma.ma_regzoro.create({
        data: {
            cve_equipo: BigInt(infoSensor.clave),
            fecha_hora: new Date(),
            dato_1: data.dato_1.toString(),
            dato_2: data.dato_2.toString(),
            dato_3: data.dato_3.toString(),
        }
    });
}

const alertaDis = (data, infoSensor) => {
    try {
        const umbralInferior = parseFloat(infoSensor.adc_3);
        const umbralSuperior = parseFloat(infoSensor.adc_1);
        if (data.dato_1 >= umbralSuperior || data.dato_1 <= umbralInferior) {
            const mensaje = `¡Alerta de Silo! \nSensor: ${infoSensor.alias}\nCapcidad actual: ${data.dato_1}°C`;
            Logger.warn(mensaje);
            telegramService.enviarAlerta(infoSensor, mensaje);
        }
    } catch (error) {
        Logger.error(`Error en alertaDis: ${error.message}`);
    }
}