require('dotenv').config();
const express = require('express');
const Logger = require('./src/shared/utils/Logger');

// ##### SOCKET.IO INTEGRATION #####
const { startTcpServer } = require('./src/shared/utils/tcpServer');
const inactividadService = require('./src/features/sensores/inactividad.service');


startTcpServer();
// Iniciar monitoreo de inactividad cada 10 minutos
setInterval(() => {
    inactividadService.checkSensorsInactivity();
}, 600000);

Logger.info("Servidor de Sensores iniciado como proceso independiente.");