const express = require('express');
const cors = require('cors');
const path = require('path');
const cookierParser = require('cookie-parser');
const Logger = require('./src/shared/utils/Logger');
const mainRouter = require('./src/index.routes');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use(cors({
  origin: 'http://nexthwd.pcz.com.mx:8080',
  credentials: true 
}));


app.use(cookierParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(mainRouter);
app.set('trust proxy', 1);

app.use((err, req, res, next) => {
  Logger.error(`Unhandled Error: ${err.message} ${err.stack}` , err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // In production, you might not want to send the stack trace
    // error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// ##### SOCKET.IO INTEGRATION #####

const API_PORT = process.env.PORT || 4000;
const http = require('http');
const { startTcpServer } = require('./src/shared/utils/tcpServer');
const inactividadService = require('./src/features/sensores/inactividad.service');
const httpServer = http.createServer(app);
startTcpServer();

// Iniciar monitoreo de inactividad cada 10 minutos
setInterval(() => {
    inactividadService.checkSensorsInactivity();
}, 600000);

httpServer.listen(API_PORT, () => {
  console.log(`API server with Sockets listening on port ${API_PORT}`);
});

module.exports = app;