const express = require('express');
const cors = require('cors');
const cookierParser = require('cookie-parser');
const Logger = require('./src/shared/utils/Logger'); // Import Logger
const mainRouter = require('./src/index.routes');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use(cors({
  origin: 'http://nexthwd.pcz.com.mx:8080', // Sin el / al final
  credentials: true // INDISPENSABLE para que viajen las cookies/tokens
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookierParser());

// Use the main router
app.use(mainRouter);
app.set('trust proxy', 1);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  Logger.error(`Unhandled Error: ${err.message}`, err.stack);
  // Default to 500 Internal Server Error, or use a custom status if available
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // In production, you might not want to send the stack trace
    // error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// ##### SOCKET.IO INTEGRATION #####

const http = require('http');
const { startTcpServer } = require('./src/shared/utils/tcpServer');
const inactividadService = require('./src/features/sensores/inactividad.service');
const httpServer = http.createServer(app);
startTcpServer();

// Iniciar monitoreo de inactividad cada 10 minutos
setInterval(() => {
    inactividadService.checkSensorsInactivity();
}, 600000);

httpServer.listen(port, () => {
  console.log(`API server with Sockets listening on port ${port}`);
});

module.exports = app;