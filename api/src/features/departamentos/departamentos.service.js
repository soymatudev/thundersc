const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError, BadRequestError } = require('../../shared/utils/CustomError');


exports.getAllDepartamentos = async () => {
    return prisma.ma_depar.findMany();
};

exports.getDepartamentoByCve = async (cve) => {
    const departamentoId = parseInt(cve, 10);
    if (isNaN(departamentoId)) {
        throw new BadRequestError('El ID del departamento debe ser un número.');
    }
    const departamento = await prisma.ma_depar.findUnique({
        where: { clave: departamentoId },
    });
    if (!departamento) {
        throw new NotFoundError(`No se encontró departamento con la clave ${departamentoId}`);
    }
    return departamento;
};

exports.updateDepartamento = async (cve, updateData) => {
    const departamentoId = parseInt(cve, 10);
    if (isNaN(departamentoId)) {
        throw new BadRequestError('El ID del departamento debe ser un número.');
    }
    try {
        const updatedDepartamento = await prisma.ma_depar.update({
            where: { clave: departamentoId },
            data: updateData,
        });
        return updatedDepartamento;
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's 'Record to update not found'
            throw new NotFoundError(`No se encontró departamento con la clave ${departamentoId}`);
        }
        throw error;
    }
};

exports.setDepartamento = async (departamentoData) => {
    const newDepartamento = await prisma.ma_depar.create({
        data: departamentoData,
    });
    return newDepartamento;
};

exports.getDepartamentosPaginados = async (page = 1, pageSize = 20, descri = '') => {
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);

    const where = descri ? {
        descri: {
            contains: descri,
            mode: 'insensitive',
        },
    } : {};

    const [total, departamentos] = await prisma.$transaction([
        prisma.ma_depar.count({ where }),
        prisma.ma_depar.findMany({
            where,
            skip,
            take,
            orderBy: {
                clave: 'asc',
            },
        }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
        departamentos,
        pagination: {
            total,
            totalPages,
            currentPage: parseInt(page, 10),
            pageSize: take,
        },
    };
};

exports.deleteDepartamento = async (cve) => {
    const departamentoId = parseInt(cve, 10);
    if (isNaN(departamentoId)) {
        throw new BadRequestError('El ID del departamento debe ser un número.');
    }
    try {
        const result = await prisma.ma_depar.delete({
            where: { clave: departamentoId },
        });
        return result;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError(`No se encontró departamento con la clave ${departamentoId}`);
        }
        throw error;
    }
};