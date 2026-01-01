const { prisma } = require('../../shared/config/prismaClient');

exports.setTelegramUsuario = async (usuarioData) => {
    const { clave } = usuarioData;
    const existingUser = await prisma.ma_chatids.findUnique({
        where: { clave: BigInt(clave) },
    });

    if (existingUser) {
        return existingUser;
    }

    return prisma.ma_chatids.create({
        data: {
            ...usuarioData,
            clave: BigInt(usuarioData.clave),
        }
    });
};

exports.getTelegramUsuarios = async () => {
    return prisma.ma_chatids.findMany();
};

exports.getTelegramUsuarioByCve = async (cve) => {
    const usuarioId = BigInt(cve);
    return prisma.ma_chatids.findUnique({
        where: { clave: usuarioId },
    });
};

exports.setTelegramUsuarioxSensor = async (usuarioSensorData) => {
    const existingSubscription = await prisma.ma_sesus.findFirst({
        where: {
            cve_usu: usuarioSensorData.cve_usu,
            cve_ses: usuarioSensorData.cve_ses,
        },
    });

    if (existingSubscription) {
        return existingSubscription;
    }

    return prisma.ma_sesus.create({
        data: usuarioSensorData,
    });
};

exports.getTelegramUsuariosxSensor = async (usuarioData) => {
    return prisma.ma_sesus.findMany({
        where: {
            cve_usu: usuarioData.cve_usu,
            cve_ses: usuarioData.cve_ses,
        },
    });
};

/**
 * Obtiene todos los Chat IDs de Telegram suscritos a las alertas de un sensor específico.
 * 
 * @param {object} infoSensor - Objeto que contiene la clave del sensor.
 * @param {number} infoSensor.clave - La clave del sensor.
 * @param {string} infoSensor.alias - El alias del sensor.
 * @returns {Promise<string[]>} - Una promesa que resuelve a un array de chat_ids.
 */
exports.getChatIdsPorSensor = async (infoSensor) => {
    const results = await prisma.ma_sesus.findMany({
        where: {
            cve_ses: infoSensor.clave,
            cns_sn: 'S',
        },
        select: {
            cve_usu: true,
        },
    });

    if (!results) {
        return [];
    }
    
    return results.map(row => row.cve_usu.trim());
};
