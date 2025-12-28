const express = require('express');
const cookierParser = require('cookie-parser');
const Logger = require('./src/utils/Logger'); // Import Logger

const almacenesRouter = require('./src/routes/almacenes.routes');
const marcasRouter = require('./src/routes/marcas.routes');
const equiposRouter = require('./src/routes/equipos.routes');
const empleadosRouter = require('./src/routes/empleados.routes');
const departamentosRouter = require('./src/routes/departamentos.routes');
const clasificacionesEquiposRouter = require('./src/routes/clasificacionesEquipo.routes');
const consultasRouter = require('./src/routes/consultas.routes');
const movimientosRouter = require('./src/routes/movimientos.routes');
const authRouter = require('./src/routes/auth.routes');
const healthRouter = require('./src/routes/health.routes');
const modulosRouter = require('./src/routes/modulos.routes');
const empresasRouter = require('./src/routes/empresas.routes');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookierParser());
// app.use(express.static('public'));
app.use('/modulos', modulosRouter);
app.use('/almacenes', almacenesRouter);
app.use('/marcas', marcasRouter);
app.use('/equipos', equiposRouter);
app.use('/empleados', empleadosRouter);
app.use('/departamentos', departamentosRouter);
app.use('/clasificaciones_equipos', clasificacionesEquiposRouter);
app.use('/consultas', consultasRouter);
app.use('/movimientos', movimientosRouter);
app.use('/empresas', empresasRouter);
app.use('/auth', authRouter);


/* ##### HEALTH CHECK ##### */

app.use('/health', healthRouter);

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
const { startTcpServer } = require('./src/utils/tcpServer');
const httpServer = http.createServer(app);
startTcpServer();

httpServer.listen(port, () => {
  console.log(`API server with Sockets listening on port ${port}`);
});

module.exports = app;