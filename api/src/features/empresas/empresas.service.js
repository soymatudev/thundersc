const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllEmpresas = async () => {
    const empresas = await prisma.ma_empresa.findMany();
    return empresas;
}

exports.getEmpresasPaginadas = async (page = 1, pageSize = 10, nombre = '') => {
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
            currentPage: parseInt(page, 10),
            pageSize: take,
        },
    };
};

exports.getEmpresaByCve = async (cve) => {
    const empresa = await prisma.ma_empresa.findUnique({ // Assuming 'clave' is unique for ma_empresa
        where: { clave: cve }
    });
    if (!empresa) {
        throw new NotFoundError(`No se encontró empresa con la clave ${cve}`);
    }
    return empresa;
}

exports.updateEmpresa = async (cve, updateData) => {
    try {
        const result = await prisma.ma_empresa.update({
            where: { clave: cve },
            data: updateData
        });
        return result;
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's 'Record to update not found'
            throw new NotFoundError(`No se encontró empresa con la clave ${cve}`);
        }
        throw error;
    }
}

exports.setEmpresa = async (empresaData) => {
    const newEmpresa = await prisma.ma_empresa.create({
        data: empresaData
    });
    return newEmpresa;
}

exports.deleteEmpresa = async (cve) => {
    try {
        const result = await prisma.ma_empresa.update({ // Assuming soft delete by setting status to false
            where: { clave: cve },
            data: { status: false }
        });
        return result;
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's 'Record to update not found'
            throw new NotFoundError(`No se encontró empresa con la clave ${cve} para desactivar`);
        }
        throw error;
    }
}