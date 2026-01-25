const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError, BadRequestError } = require('../../shared/utils/CustomError');

exports.getAllEquipos = async () => {
    return prisma.ma_eqsis.findMany({
        include: {
            ma_clasif: true,
            ma_marca: true
        }
    });
};

exports.getEquipoByCve = async (cve) => {
    const equipoId = parseInt(cve, 10);
    if (isNaN(equipoId)) {
        throw new BadRequestError('El ID del equipo debe ser un número.');
    }
    const equipo = await prisma.ma_eqsis.findUnique({
        where: { clave: equipoId },
    });
    if (!equipo) {
        throw new NotFoundError(`No se encontró equipo con la clave ${equipoId}`);
    }
    return equipo;
};

exports.getEquipoBySerie = async (serie) => {
    return prisma.ma_eqsis.findMany({
        where: { serie: serie },
    });
};

exports.getFolioByClasif = async (cve_clasif) => {
    const clasifId = parseInt(cve_clasif, 10);
    if (isNaN(clasifId)) {
        throw new BadRequestError('El ID de la clasificación debe ser un número.');
    }
    const folio = await prisma.ma_folio.findUnique({
        where: { cve_clasif: clasifId }
    });
    return folio || { cve_clasif: clasifId, ultimo_folio: 0 };
};

exports.updateEquipo = async (cve, updateData) => {
    const equipoId = parseInt(cve, 10);
    if (isNaN(equipoId)) {
        throw new BadRequestError('El ID del equipo debe ser un número.');
    }
    try {
        return await prisma.ma_eqsis.update({
            where: { clave: equipoId },
            data: updateData,
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError(`No se encontró equipo con la clave ${equipoId}`);
        }
        throw error;
    }
};

exports.setEquipo = async (equipoData) => {
    return prisma.ma_eqsis.create({
        data: equipoData,
    });
};

exports.createMassiveEquipos = async (equiposData) => {
    const { cve_marca, cve_clasif, modelo, entries, cve_recep } = equiposData;

    const clasifId = parseInt(cve_clasif);
    const recepId = parseInt(cve_recep);
    if (isNaN(clasifId) || isNaN(recepId) || isNaN(parseInt(cve_marca))) {
        throw new BadRequestError('Las claves de clasificación, marca y recepción deben ser números.');
    }

    const [clasif, empleado] = await Promise.all([
        prisma.ma_clasif.findUnique({ where: { clave: clasifId } }),
        prisma.ma_emple.findUnique({ where: { id: recepId } })
    ]);

    if (!empleado) {
        throw new NotFoundError('El empleado de recepción no existe.');
    }
    if (!clasif) {
        throw new NotFoundError('La clasificación especificada no existe.');
    }

    const prefix = clasif.descri?.trim().substring(0, 3).toUpperCase() || 'EQU';
    const cve_depar = empleado.cve_depar;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    return prisma.$transaction(async (tx) => {
        const folioRecord = await tx.ma_folio.findUnique({
            where: { cve_clasif: clasifId }
        });

        let currentFolio = folioRecord ? (folioRecord.ultimo_folio || 0) : 0;
        const createdEquipos = [];

        for (const entry of entries) {
            const { serie, cantidad } = entry;
            const count = parseInt(cantidad) || 1;

            for (let i = 0; i < count; i++) {
                currentFolio++;
                const folioPad = currentFolio.toString().padStart(3, '0');
                const finalCodInv = `${prefix}-${todayStr}-${folioPad}`;

                const newEquipo = await tx.ma_eqsis.create({
                    data: {
                        serie: serie || 'S/N',
                        cod_inv: finalCodInv,
                        cve_marca: parseInt(cve_marca),
                        cve_clasif: clasifId,
                        modelo,
                        f_regis: new Date(),
                        status: 'A',
                    },
                });

                await tx.ma_eqasis.create({
                    data: {
                        cve_alm: '999', // Default almacen, could be a parameter
                        cve_eqsis: newEquipo.clave,
                        cve_emple: recepId,
                        cve_depar: cve_depar,
                        f_movto: new Date(),
                    },
                });

                createdEquipos.push(newEquipo);
            }
        }

        await tx.ma_folio.upsert({
            where: { cve_clasif: clasifId },
            update: { ultimo_folio: currentFolio },
            create: { cve_clasif: clasifId, ultimo_folio: currentFolio }
        });

        return createdEquipos;
    });
};