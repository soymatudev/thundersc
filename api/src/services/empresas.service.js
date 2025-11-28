const Logger = require('../utils/Logger');
const { prisma } = require('../config/prismaClient');

exports.getAllEmpresas = async () => {
    try {
        const empresas = await prisma.ma_empresa.findMany();
        return empresas;
    } catch (error) {
        Logger.error(`Error fetching empresas: ${error.message}`);
        throw new Error('Failed to fetch empresas due to server error');
    }
}

exports.getEmpresaByCve = async (cve) => {
    try {
        const empresa = await prisma.ma_empresa.findFirst({
            where: { clave: cve }
        });
        return empresa;
    } catch (error) {
        Logger.error(`Error fetching empresa by cve: ${error.message}`);
        throw new Error('Failed to fetch empresa due to server error');
    }
}

exports.updateEmpresa = async (cve, updateData) => {
    try {
        const result = await prisma.ma_empresa.update({
            where: { clave: cve },
            data: updateData
        });
        return result;
    } catch (error) {
        Logger.error(`Error updating empresa: ${error.message}`);
        throw new Error('Failed to update empresa due to server error');
    }
}

exports.setEmpresa = async (empresaData) => {
    try {
        const newEmpresa = await prisma.ma_empresa.create({
            data: empresaData
        });
        return newEmpresa;
    } catch (error) {
        Logger.error(`Error creating empresa: ${error.message}`);
        throw new Error('Failed to create empresa due to server error');
    }
}