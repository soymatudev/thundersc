const Logger = require('../../shared/utils/Logger');
const { prisma } = require('../../shared/config/prismaClient');
const dayjs = require('dayjs');


/**
 * Obtiene todos los sensores (equipos) y la descripción de su unidad asociada.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de sensores con su unidad incluida.
 */
exports.getAllSensores = async () => {
    const equipos = await prisma.ma_equipo.findMany({
        include: {
            ma_unidad: {
                select: {
                    descri: true
                }
            }
        }
    });

    // Aplanamos la estructura para que coincida con la salida original.
    return equipos.map(equipo => {
        const { ma_unidad, ...rest } = equipo;
        return {
            ...rest,
            unidad: ma_unidad ? ma_unidad.descri : null
        };
    });
};

/**
 * Obtiene un sensor por su clave (ID).
 * @param {number|string} cve La clave (ID) del sensor.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el objeto del sensor o null si no se encuentra.
 */
exports.getSensorByCve = async (cve) => {
    const sensorId = parseInt(cve, 10);
    if (isNaN(sensorId)) {
        throw new Error('La clave (ID) del sensor debe ser un número.');
    }
    return prisma.ma_equipo.findUnique({
        where: { clave: sensorId },
    });
};

/**
 * Obtiene un sensor por su nombre.
 * @param {string} name El nombre del sensor.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el primer sensor encontrado con ese nombre o null.
 */
exports.getSensorByName = async (name) => {
    return prisma.ma_equipo.findFirst({
        where: { nombre: name },
    });
};

/**
 * Obtiene el estatus actual de todos los sensores para el dashboard.
 * Optimizado para obtener solo la última lectura por sensor.
 * @param {number|string} userId ID del usuario para filtrar permisos.
 * @returns {Promise<Array>}
 */
exports.getDashboardStatus = async (userId) => {
    // 1. Obtener los permisos del usuario en ma_sesus (cns_sn == 'S')
    // Nota: El cve_usu en ma_sesus es Char(11), compensamos el padding si es necesario
    const permisos = await prisma.ma_sesus.findMany({
        where: {
            cve_usu: userId.toString().padEnd(11, ' '),
            cns_sn: {
                contains: 'S' // Usamos contains por si hay espacios
            }
        },
        select: {
            cve_ses: true
        }
    });

    const sensorIdsPermitidos = permisos.map(p => p.cve_ses).filter(id => id !== null);

    if (sensorIdsPermitidos.length === 0) {
        return [];
    }

    // 2. Obtener solo los sensores permitidos
    const sensores = await prisma.ma_equipo.findMany({
        where: {
            clave: { in: sensorIdsPermitidos }
        },
        include: {
            ma_unidad: true
        }
    });

    const now = dayjs().toDate();
    const MinutesAgo = dayjs(now).subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss');

    // 3. Para cada sensor, obtener la lectura más reciente
    const statusData = await Promise.all(sensores.map(async (sensor) => {
        // Obtenemos el registro más reciente (sin filtros de fecha) para el status/is_online
        const absoluteLast = await prisma.ma_regzoro.findFirst({
            where: { cve_equipo: BigInt(sensor.clave) },
            orderBy: { fecha_hora: 'desc' }
        });

        const todayStart = dayjs().startOf('day').toDate();
        let ultimaLectura = null;

        if (absoluteLast) {
            // Aplicar corrección de zona horaria manual solicitada por el usuario
            const fecha = absoluteLast.fecha_hora;
            absoluteLast.fecha_hora = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);

            // Solo consideramos la lectura como "actual" si es de hoy
            if (absoluteLast.fecha_hora >= todayStart) {
                ultimaLectura = absoluteLast;
            }
        }

        //console.log(dayjs(ultimaLectura.fecha_hora).format('YYYY-MM-DD HH:mm:ss'))

        // Mapeo básico
        const data = {
            id: sensor.clave,
            alias: sensor.alias || sensor.nombre,
            nombre: sensor.nombre,
            cve_unidad: sensor.cve_unidad?.trim(),
            unidad_desc: sensor.ma_unidad?.descri?.trim(),
            adc_1: parseFloat(sensor.adc_1) || 0, // Límite Superior (usualmente Temp)
            adc_3: parseFloat(sensor.adc_3) || 0, // Límite Inferior (usualmente Temp)
            last_check: absoluteLast ? absoluteLast.fecha_hora : null,
            is_online: ultimaLectura ? (dayjs(ultimaLectura.fecha_hora).format('YYYY-MM-DD HH:mm:ss') > MinutesAgo) : false,
            lectura: {}
        };

        // Diferenciación de tipos
        if (ultimaLectura) {
            const val1 = parseFloat(ultimaLectura.dato_1) || 0;
            const val2 = parseFloat(ultimaLectura.dato_2) || 0;

            if (data.cve_unidad === 'TEM') { // TERMOMETRO
                data.lectura = {
                    temperatura: val1,
                    humedad: val2
                };
            } else if (data.cve_unidad === 'SIL') { // SILO
                data.lectura = {
                    nivel_porcentual: val1
                };
            } else {
                data.lectura = {
                    dato_1: val1,
                    dato_2: val2,
                    dato_3: ultimaLectura.dato_3
                };
            }
        } else {
            // Si no hay lectura hoy, valores por defecto según regla de negocio
            if (data.cve_unidad === 'TEM') {
                data.lectura = { temperatura: 0, humedad: 0 };
            } else if (data.cve_unidad === 'SIL') {
                data.lectura = { nivel_porcentual: 0 };
            } else {
                data.lectura = { dato_1: 0, dato_2: 0, dato_3: '0' };
            }
        }

        return data;
    }));


    return statusData;
};

/**
 * Obtiene el historial de lecturas de sensores con downsampling opcional.
 * @param {Date} fechaInicio 
 * @param {Date} fechaFin 
 * @param {number} [cveEquipo] 
 * @returns {Promise<Array>}
 */
exports.getHistory = async (fechaInicioParam, fechaFinParam, cveEquipo) => {
    const fechaInicio = fechaInicioParam;
    const fechaFin = fechaFinParam;

    // Calculamos el rango en horas
    const diffHours = (fechaFin - fechaInicio) / (1000 * 60 * 60);
    const needDownsampling = diffHours > 24;

    let historyData;

    // Downsampling por hora usando Raw Query de Prisma
    // Casteamos dato_1 y dato_2 a float para promediar
    // DATE_TRUNC('hour', fecha_hora) agrupa por hora
    
    // Usamos .toISOString() para asegurar formato compatible
    let whereClause = `WHERE fecha_hora >= '${fechaInicio}' AND fecha_hora <= '${fechaFin}'`;

    if (cveEquipo) {
        whereClause += ` AND cve_equipo = ${cveEquipo}`;
    }

    historyData = await prisma.$queryRawUnsafe(`
        SELECT 
            cve_equipo,
            fecha_hora,
            AVG(CAST(NULLIF(dato_1, '') AS FLOAT)) as avg_val1,
            AVG(CAST(NULLIF(dato_2, '') AS FLOAT)) as avg_val2
        FROM "ma_regzoro"
        ${whereClause}
        GROUP BY cve_equipo, fecha_hora
        ORDER BY fecha_hora ASC
    `);

    // Mapear resultado raw a formato estándar
    historyData = historyData.map(row => ({
        cve_equipo: Number(row.cve_equipo),
        fecha_hora: dayjs(dayjs(row.fecha_hora).toString().split(' GMT')[0]).format('YYYY-MM-DD HH:mm:ss') , // Ajuste de zona horaria
        dato_1: row.avg_val1,
        dato_2: row.avg_val2
    }));

    // Enriquecer con nombre del sensor
    // Primero obtenemos los sensores únicos involucrados
    const sensorIds = [...new Set(historyData.map(d => d.cve_equipo))];
    const sensores = await prisma.ma_equipo.findMany({
        where: { clave: { in: sensorIds } },
        select: { clave: true, alias: true, nombre: true }
    });

    const sensorMap = sensores.reduce((acc, s) => {
        acc[s.clave] = s.alias || s.nombre;
        return acc;
    }, {});

    return historyData.map(d => ({
        ...d,
        sensor_nombre: sensorMap[d.cve_equipo] || 'Desconocido'
    }));
};

