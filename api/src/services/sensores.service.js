const prisma = require('../config/prismaClient');

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
