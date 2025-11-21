const net = require('net');
const Logger = require('./Logger');
const { parseSensorData } = require('./parser');
const sensoresLecturasService = require('../services/sensores_lecturas.service');
const { initializeTelegramBot } = require('../services/telegram.service');

exports.startTcpServer = () => {
    initializeTelegramBot();
    // Usar una variable de entorno para el puerto, con un valor por defecto.
    const TCP_PORT = process.env.TCP_PORT || 1085;
    const server = net.createServer((socket) => {
        const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
        Logger.info(`Nuevo cliente TCP conectado: ${remoteAddress}`);

        socket.on('data', (data) => {
            const messageString = socketMessageString(data);
            Logger.info(`Dato crudo TCP recibido de ${remoteAddress}: ${messageString}`);
            const parsedData = parseSensorData(messageString);

            if (parsedData) {
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

    socketServerListen(server, TCP_PORT)
    socketErrorServer(server);
};

const socketMessageString = (data) => {
    const messageString = data.toString().trim();
    if (messageString === '' ) return;
    if (messageString === 'exit' || messageString === 'bye') socketClose(socket, remoteAddress);
    return messageString;
}

const clientClose = (socket, remoteAddress) => {
    socket.on('close', () => {
        Logger.info(`Cliente TCP desconectado: ${remoteAddress}`);
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

const socketServerListen = (server, TCP_PORT) => {
    server.listen(TCP_PORT, '0.0.0.0', () => {
        Logger.info(`Servidor TCP para sensores escuchando en el puerto ${TCP_PORT}`);
    });
}

const socketErrorServer = (server) => {
    server.on('error', (err) => {
        Logger.error(`Error en el servidor TCP: ${err.message}`);
    });
}