const Logger = require('../utils/Logger');
const sensoresService = require('../services/sensores.service');
const { initializeTelegramBot } = require('../services/telegram.service');

/**
 * Parsea el string crudo del sensor y lo convierte en un objeto estructurado.
 * @param {string} message - El mensaje recibido del socket.
 * @returns {object|null} - Un objeto con los datos parseados o null si el formato es inválido.
 */
const parseSensorData = (message) => {
    const parts = message.split('|');
    if (parts.length < 2) return null; // Formato inválido

    const dataPart = parts[0];
    const user = parts[1];
    const company = parts[2] || null;

    const dataValues = dataPart.split(',');

    // Formato 2: Evento genérico (ej. Temp03,event,NEG,TMP001,V2)
    if (dataPart.includes(',event,')) {
        if (dataValues.length < 4) return null;
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
        if (dataValues.length < 3) return null;
        return {
            type: 'temperature',
            sensorName: dataValues[0],
            temperature: parseFloat(dataValues[1]),
            humidity: parseFloat(dataValues[2]),
            sensorModel: dataValues[3] || null,
            version: dataValues[4] || null,
            user,
            company,
            rawData: message,
        };
    }
};


/**
 * Inicializa el manejador de eventos de Socket.IO.
 * @param {SocketIO.Server} io - La instancia del servidor de Socket.IO.
 */
const initializeSocketHandler = (io) => {
    initializeTelegramBot();
    io.on('connection', (socket) => {
        Logger.info(`Nuevo cliente conectado al socket: ${socket.id}`);

        // El sensor no emite eventos con nombre, solo envía data.
        // Escuchamos el evento 'message' o 'data' genérico.
        socket.on('message', (data) => {
            const messageString = data.toString().trim();
            if (messageString === '') return;

            Logger.info(`Mensaje crudo recibido de ${socket.id}: ${messageString}`);
            
            const parsedData = parseSensorData(messageString);

            if (parsedData) {
                // Una vez parseado, enviamos los datos al servicio de sensores para procesar.
                sensoresService.registrarLectura(parsedData)
                    .then(response => {
                        socket.emit('response', { status: 'success', data: response });
                    })
                    .catch(error => {
                        Logger.error(`Error al procesar datos del sensor: ${error.message}`);
                        socket.emit('response', { status: 'error', message: error.message });
                    });
            } else {
                Logger.warn(`Formato de mensaje inválido recibido: ${messageString}`);
                socket.emit('response', { status: 'error', message: 'Formato de mensaje no válido.' });
            }
        });

        socket.on('disconnect', () => {
            Logger.info(`Cliente desconectado del socket: ${socket.id}`);
        });
    });

    Logger.info('Manejador de Sockets inicializado.');
};

module.exports = initializeSocketHandler;
