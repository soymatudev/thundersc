const Logger = require('../../shared/utils/Logger');
const { prisma } = require('../../shared/config/prismaClient');

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

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // 3. Para cada sensor, obtener la lectura más reciente
    const statusData = await Promise.all(sensores.map(async (sensor) => {
        const ultimaLectura = await prisma.ma_regzoro.findFirst({
            where: { cve_equipo: BigInt(sensor.clave) },
            orderBy: { fecha_hora: 'desc' }
        });

        // Mapeo básico
        const data = {
            id: sensor.clave,
            alias: sensor.alias || sensor.nombre,
            nombre: sensor.nombre,
            cve_unidad: sensor.cve_unidad?.trim(),
            unidad_desc: sensor.ma_unidad?.descri?.trim(),
            adc_1: parseFloat(sensor.adc_1) || 0, // Límite Superior (usualmente Temp)
            adc_3: parseFloat(sensor.adc_3) || 0, // Límite Inferior (usualmente Temp)
            last_check: ultimaLectura ? ultimaLectura.fecha_hora : null,
            is_online: ultimaLectura ? (new Date(ultimaLectura.fecha_hora) > fiveMinutesAgo) : false,
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
        }

        return data;
    }));

    return statusData;
};
