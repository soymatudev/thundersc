const Logger = require('../../shared/utils/Logger');
const { prisma } = require('../../shared/config/prismaClient');

exports.getAllEmpresas = async () => {
    try {
        const empresas = await prisma.ma_empresa.findMany();
        return empresas;
    } catch (error) {
        Logger.error(`Error fetching empresas: ${error.message}`);
        throw new Error('Failed to fetch empresas due to server error');
    }
}

exports.getEmpresasPaginadas = async (page = 1, pageSize = 10, nombre = '') => {
    try {
        const skip = (page - 1) * pageSize;
        const take = parseInt(pageSize, 10);

        const where = nombre ? {
            nombre: {
                contains: nombre,
                mode: 'insensitive',
            },
        } : {};

        const [total, empresas] = await prisma.$transaction([
            prisma.ma_empresa.count({ where }),
            prisma.ma_empresa.findMany({
                where,
                skip,
                take,
                orderBy: {
                    nombre: 'asc',
                },
            }),
        ]);

        const totalPages = Math.ceil(total / take);

        return {
            empresas,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                pageSize: take,
            },
        };
    } catch (error) {
        Logger.error(`Error fetching paginated empresas: ${error.message}`);
        throw new Error(`Error fetching paginated empresas: ${error.message}`);
    }
};

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

exports.deleteEmpresa = async (cve) => {
    try {
        const result = await prisma.ma_empresa.update({
            where: { clave: cve },
            data: { status: false }
        });
        return result;
    } catch (error) {
        Logger.error(`Error deleting empresa: ${error.message}`);
        if (error.code === 'P2025') {
            throw new Error('Empresa not found');
        }
        throw new Error(`Error deleting empresa: ${error.message}`);
    }
}