const express = require('express');
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

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// app.use(express.static('public')); 
app.use('/api/modulos', modulosRouter);
app.use('/api/almacenes', almacenesRouter);
app.use('/api/marcas', marcasRouter);
app.use('/api/equipos', equiposRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/departamentos', departamentosRouter);
app.use('/api/clasificaciones_equipos', clasificacionesEquiposRouter);
app.use('/api/consultas', consultasRouter);
app.use('/api/movimientos', movimientosRouter);
app.use('/api/auth', authRouter);


/* ##### HEALTH CHECK ##### */

app.use('/api/health', healthRouter);

// ##### SOCKET.IO INTEGRATION #####

const http = require('http');
const { startTcpServer } = require('./src/utils/tcpServer');
const httpServer = http.createServer(app);
startTcpServer();

httpServer.listen(port, () => {
  console.log(`API server with Sockets listening on port ${port}`);
});

module.exports = app;