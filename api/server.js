const express = require('express');
const { getConnection, testConnection } = require('./src/config/database');
const almacenesRouter = require('./src/routes/almacenes.routes');
const marcasRouter = require('./src/routes/marcas.routes');
const equiposRouter = require('./src/routes/equipos.routes');
const empleadosRouter = require('./src/routes/empleados.routes');
const departamentosRouter = require('./src/routes/departamentos.routes');
const clasificacionesEquiposRouter = require('./src/routes/clasificacionesEquipo.routes');
const consultasRouter = require('./src/routes/consultas.routes');
const movimientosRouter = require('./src/routes/movimientos.routes');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// app.use(express.static('public'))
; 
app.use('/api/almacenes', almacenesRouter);
app.use('/api/marcas', marcasRouter);
app.use('/api/equipos', equiposRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/departamentos', departamentosRouter);
app.use('/api/clasificaciones_equipos', clasificacionesEquiposRouter);
app.use('/api/consultas', consultasRouter);
app.use('/api/movimientos', movimientosRouter);


/* ##### HEALTH CHECK ##### */

app.get('/api/health', async (req, res) => {
  try {
      const connection = testConnection();
      if (connection) {
          res.status(200).json({ status: 'OK', message: 'Database connection successful' });
      } else {
          res.status(500).json({ status: 'Error', message: 'Database connection failed' });
      }
  } catch (error) {
      res.status(500).json({ status: 'Error', message: error.message });
  }
});


app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports = app;