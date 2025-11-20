const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultas.controller');

/**
 * @swagger
 * /api/consultas/inventario-por-equipo:
 *   get:
 *     summary: Genera un reporte de inventario de equipos.
 *     description: Retorna un listado de equipos basado en filtros opcionales como almacén, fechas, marca, etc.
 *     tags: [Consultas]
 *     parameters:
 *       - in: query
 *         name: cve_alm
 *         schema:
 *           type: string
 *         description: Clave del almacén a filtrar.
 *       - in: query
 *         name: f_ini
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD).
 *       - in: query
 *         name: f_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (YYYY-MM-DD).
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Clave de la marca.
 *       - in: query
 *         name: clasif
 *         schema:
 *           type: string
 *         description: Clave de la clasificación.
 *       - in: query
 *         name: empleado
 *         schema:
 *           type: string
 *         description: Clave del empleado.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [1, 0]
 *         description: "Estatus del equipo: 1 para Activos, 0 para Inactivos."
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente.
 *       500:
 *         description: Error en el servidor.
 */
router.get('/inventario-por-equipo', consultasController.getInventarioPorEquipo);

router.get('/ingresos-por-equipo', consultasController.getIngresosPorEquipo);

/**
 * @swagger
 * /api/consultas/reporte-backups:
 *   get:
 *     summary: Genera un reporte del estado de los backups de los servidores.
 *     description: Retorna una lista de todos los servidores (hosts) y el estado de su último backup registrado.
 *     tags: [Consultas, Backups]
 *     responses:
 *       200:
 *         description: Reporte de backups generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 columns:
 *                   type: array
 *                   description: Definiciones de las columnas para la grilla de la UI.
 *                   items:
 *                     type: object
 *                 data:
 *                   type: array
 *                   description: Los datos del reporte de backups.
 *                   items:
 *                     type: object
 *       500:
 *         description: Error en el servidor.
 */
router.get('/reporte-backups', consultasController.getReporteBackups);


module.exports = router;