const net = require('net');
const Logger = require('./Logger');
const { parseSensorData } = require('./parser');
const sensoresLecturasService = require('../../features/sensores/sensores_lecturas.service');
const { initializeTelegramBot } = require('../../features/telegram/telegram.service');

// Mapa para rastrear sockets activos por nombre de sensor
const allConnections = new Set();
const activeSockets = new Map();

/**
 * Envía un mensaje a un sensor específico si está conectado.
 * @param {string} sensorName 
 * @param {string} message 
 */
exports.sendToSensor = (sensorName, message) => {
    const socket = activeSockets.get(sensorName);
    if (socket && !socket.destroyed) {
        socket.write(`${message}\n`);
        Logger.info(`Mensaje enviado a sensor ${sensorName}: ${message}`);
        return true;
    }
    Logger.warn(`No se pudo enviar mensaje a ${sensorName}: Sensor no conectado o socket destruido.`);
    return false;
};

const socketsReport = (socket)  => {
    Logger.info(">>> Difundiendo comando ALL a todos los dispositivos TCP conectados.");
    
    allConnections.forEach((client) => {
        if (client !== socket && !client.destroyed) {
            // Enviamos el texto "ALL" seguido de un salto de línea
            client.write(`ALL\n`); 
        }
    });
}

exports.startTcpServer = () => {
    initializeTelegramBot();
    // Usar una variable de entorno para el puerto, con un valor por defecto.
    const TCP_PORT = process.env.SOCKET_PORT || 1085;
    const TCP_IP = process.env.SOCKET_IP || "0.0.0.0";
    const server = net.createServer((socket) => {
        const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
        allConnections.add(socket);
        Logger.info(`Nuevo cliente TCP conectado: ${remoteAddress}`);

        socket.on('data', (data) => {
            const messageString = socketMessageString(data);
            Logger.info(`Dato crudo TCP recibido de ${remoteAddress}: ${messageString}`);
            const parsedData = parseSensorData(messageString);

            if (!messageString || typeof messageString !== 'string') return;

            if (messageString.toUpperCase().includes('ALL')) {
                socketsReport(socket);
            } else if (parsedData) {
                // Registrar el socket para permitir refrescos manuales
                if (parsedData.sensorName) {
                    socket.sensorName = parsedData.sensorName;
                    activeSockets.set(parsedData.sensorName, socket);
                }

                sensoresLecturasService.registrarLectura(parsedData)
                    .then(response => {
                        Logger.info(`Datos de ${remoteAddress} procesados correctamente.`);
                        socket.write(`ACK: ${response.message}\n`);
                    })
                    .catch(error => {
                        Logger.error(`Error al procesar datos TCP de ${remoteAddress}: ${error.message}`);
                        socket.write(`NACK: ${error.message}\n`);
                    });
            } else {
                Logger.warn(`Formato de mensaje TCP inválido de ${remoteAddress}: ${messageString}`);
                socket.write('NACK: Formato de mensaje no válido.\n');
            }
        });

        clientClose(socket, remoteAddress);
        socketErrorTCP(socket, remoteAddress);
        socket.write('Bienvenido al Servidor TCP de Sensores\n');
    });

    socketServerListen(server, TCP_PORT, TCP_IP);
    socketErrorServer(server);
};

const socketMessageString = (data) => {
    if (data) messageString = data.toString().trim();
    if (messageString === '' ) return;
    if (messageString === 'exit' || messageString === 'bye') socketClose(socket, remoteAddress);
    return messageString;
}

const clientClose = (socket, remoteAddress) => {
    socket.on('close', () => {
        Logger.info(`Cliente TCP desconectado: ${remoteAddress}`);
        if (socket.sensorName) {
            activeSockets.delete(socket.sensorName);
            Logger.info(`Sensor ${socket.sensorName} removido de sockets activos.`);
        }
    });
}

const socketClose = (socket, remoteAddress) => {
    Logger.info(`Cliente TCP ${remoteAddress} ha solicitado desconexión.`);
    socket.end('Desconectando...\n');
    return;
}


const socketErrorTCP = (socket, remoteAddress) => {
    socket.on('error', (err) => {
        Logger.error(`Error en socket TCP de ${remoteAddress}: ${err.message}`);
    });
}

const socketServerListen = (server, TCP_PORT, TCP_IP) => {
    server.listen(TCP_PORT, TCP_IP, () => {
        Logger.info(`Servidor TCP ${TCP_IP} para sensores escuchando en el puerto ${TCP_PORT}`);
    });
}

const socketErrorServer = (server) => {
    server.on('error', (err) => {
        Logger.error(`Error en el servidor TCP: ${err.message}`);
    });
}