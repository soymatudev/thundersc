const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError } = require('../../shared/utils/CustomError');


exports.getAllAlmacenes = async () => {
    const almacenes = await prisma.ma_almac.findMany();
    return almacenes;
}

exports.getAlmacenesByCve = async (cve) => {
    const almacen = await prisma.ma_almac.findUnique({
        where: { clave: cve }
    });
    if (!almacen) {
        throw new NotFoundError(`Almacen with clave ${cve} not found`);
    }
    return almacen;
}

exports.updateAlmacen = async (cve, updateData) => {
    const almacen = await prisma.ma_almac.findUnique({ where: { clave: cve } });

    if (!almacen) {
        throw new NotFoundError(`Almacen with clave ${cve} not found`);
    }

    const result = await prisma.ma_almac.update({
        where: { clave: cve },
        data: updateData
    });
    return result;
}

exports.setAlmacen = async (almacenData) => {
    const newAlmacen = await prisma.ma_almac.create({
        data: almacenData
    });
    return newAlmacen;
}

exports.deleteAlmacen = async (cve) => {
    const almacen = await prisma.ma_almac.findUnique({ where: { clave: cve } });

    if (!almacen) {
        throw new NotFoundError(`Almacen with clave ${cve} not found`);
    }

    const result = await prisma.ma_almac.update({
        where: { clave: cve },
        data: { status: false }
    });
    return result;
}

exports.getAlmacenesPaginados = async (page = 1, pageSize = 20, descri = '') => {
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);

    const where = descri ? {
        descri: {
            contains: descri,
            mode: 'insensitive',
        },
    } : {};

    const [total, almacenes] = await prisma.$transaction([
        prisma.ma_almac.count({ where }),
        prisma.ma_almac.findMany({
            where,
            skip,
            take,
            orderBy: {
                descri: 'asc',
            },
        }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
        almacenes,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            pageSize: take,
        },
    };
};
