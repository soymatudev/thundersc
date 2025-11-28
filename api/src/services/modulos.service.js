const Logger = require('../utils/Logger');
const { prisma } = require('../config/prismaClient');

exports.getAllModulos = async () => {
    try {
        const modulos = await prisma.ma_modulo.findMany();
        return modulos;
    } catch (error) {
        Logger.error(`Error fetching modulos: ${error.message}`);
        throw new Error('Failed to fetch modulos due to server error');
    }
}

exports.getModuloByCve = async (cve) => {
    try {
        const modulo = await prisma.ma_modulo.findFirst({
            where: { clave: parseInt(cve) }
        });
        return modulo;
    } catch (error) {
        Logger.error(`Error fetching modulo by cve: ${error.message}`);
        throw new Error('Failed to fetch modulo due to server error');
    }
}

exports.updateModulo = async (cve, updateData) => {
    try {
        const result = await prisma.ma_modulo.update({
            where: { clave: parseInt(cve) },
            data: updateData
        });
        return result;
    } catch (error) {
        Logger.error(`Error updating modulo: ${error.message}`);
        throw new Error('Failed to update modulo due to server error');
    }
}

exports.setModulo = async (moduloData) => {
    try {
        const newModulo = await prisma.ma_modulo.create({
            data: moduloData
        });
        return newModulo;
    } catch (error) {
        Logger.error(`Error creating modulo: ${error.message}`);
        throw new Error('Failed to create modulo due to server error');
    }
}