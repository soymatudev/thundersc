const Logger = require('./Logger');

/**
 * Parsea el string crudo del sensor y lo convierte en un objeto estructurado.
 * @param {string} message - El mensaje recibido del socket.
 * @returns {object|null} - Un objeto con los datos parseados o null si el formato es inválido.
 */
const parseSensorData = (message) => {
    const parts = message.split('|');
    if (parts.length < 2) {
        Logger.warn(`Formato de mensaje inválido (sin '|'): ${message}`);
        return null;
    }

    const dataPart = parts[0];
    const user = parts[1];
    const company = parts[2] || null;

    const dataValues = dataPart.split(',');

    // Formato 2: Evento genérico (ej. Temp03,event,NEG,TMP001,V2)
    if (dataPart.includes(',event,')) {
        if (dataValues.length < 4) {
            Logger.warn(`Formato de evento genérico inválido: ${dataPart}`);
            return null;
        }
        return {
            type: 'generic_event',
            sensorName: dataValues[0],
            eventType: dataValues[2],
            sensorModel: dataValues[3],
            version: dataValues[4] || null,
            user,
            company,
            rawData: message,
        };
    } 
    // Formato 1: Temperatura (ej. Temp02,15.60,88.00,TMP002,V1)
    else {
        if (dataValues.length < 3) {
            Logger.warn(`Formato de temperatura inválido: ${dataPart}`);
            return null;
        }
        return {
            type: 'temperature',
            sensorName: dataValues[0],
            dato_1: parseFloat(dataValues[1]),
            dato_2: parseFloat(dataValues[2]),
            sensorModel: dataValues[3] || null,
            version: dataValues[4] || null,
            user,
            company,
            rawData: message,
        };
    }
};

module.exports = {
    parseSensorData,
};
