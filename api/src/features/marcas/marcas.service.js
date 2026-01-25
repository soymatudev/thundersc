const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError, BadRequestError } = require('../../shared/utils/CustomError');

exports.getAllMarcas = async () => {
    return prisma.ma_marca.findMany();
};

exports.getMarcasPaginadas = async (pageNum, pageSizeNum, descri) => {
    const skip = (pageNum - 1) * pageSizeNum;
    const whereClause = descri ? { descri: { contains: descri, mode: 'insensitive' } } : {};

    const [total, marcas] = await prisma.$transaction([
        prisma.ma_marca.count({ where: whereClause }),
        prisma.ma_marca.findMany({
            skip: skip,
            take: pageSizeNum,
            where: whereClause,
            orderBy: { clave: 'asc' },
        }),
    ]);

    const totalPages = Math.ceil(total / pageSizeNum);

    return {
        marcas,
        total,
        currentPage: pageNum,
        totalPages,
    };
};

exports.getMarcaByCve = async (cve) => {
    const marcaId = parseInt(cve, 10);
    if (isNaN(marcaId)) {
        throw new BadRequestError('El ID de la marca debe ser un número.');
    }
    const marca = await prisma.ma_marca.findUnique({
        where: { clave: marcaId },
    });
    if (!marca) {
        throw new NotFoundError(`No se encontró marca con la clave ${marcaId}`);
    }
    return marca;
};

exports.updateMarca = async (cve, updateData) => {
    const marcaId = parseInt(cve, 10);
    if (isNaN(marcaId)) {
        throw new BadRequestError('El ID de la marca debe ser un número.');
    }
    try {
        const updatedMarca = await prisma.ma_marca.update({
            where: { clave: marcaId },
            data: updateData,
        });
        return updatedMarca;
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's 'Record to update not found'
            throw new NotFoundError(`No se encontró marca con la clave ${marcaId}`);
        }
        throw error;
    }
};

exports.setMarca = async (marcaData) => {
    return prisma.ma_marca.create({
        data: marcaData,
    });
};

exports.deleteMarca = async (cve) => {
    const marcaId = parseInt(cve, 10);
    if (isNaN(marcaId)) {
        throw new BadRequestError('El ID de la marca debe ser un número.');
    }
    try {
        const deletedMarca = await prisma.ma_marca.delete({
            where: { clave: marcaId },
        });
        return deletedMarca;
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's 'Record to delete not found'
            throw new NotFoundError(`No se encontró marca con la clave ${marcaId}`);
        }
        throw error;
    }
};