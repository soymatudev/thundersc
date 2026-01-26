const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError, BadRequestError } = require('../../shared/utils/CustomError');

/**
 * Busca un equipo por su código de inventario y retorna su ubicación actual.
 * @param {string} cod_inv - Código de inventario del equipo.
 */
exports.getEquipoWithLocation = async (cod_inv) => {
    // 1. Buscar el equipo por código de inventario
    const equipo = await prisma.ma_eqsis.findUnique({
        where: { cod_inv: cod_inv.trim() },
        include: {
            ma_marca: {
                select: { descri: true }
            },
            ma_clasif: {
                select: { descri: true }
            },
        }
    });

    if (!equipo) {
        throw new NotFoundError(`No se encontró equipo con el código de inventario: ${cod_inv}`);
    }

    // 2. Obtener la última asignación/movimiento en ma_eqasis
    const ultimaAsignacion = await prisma.ma_eqasis.findFirst({
        where: { cve_eqsis: equipo.clave },
        orderBy: { f_movto: 'desc' },
        include: {
            ma_emple: {
                select: { descri: true, clave: true }
            },
            ma_depar: {
                select: { descri: true }
            }
        }
    });

    // 3. Aplanar respuesta
    return {
        clave: equipo.clave,
        cod_inv: equipo.cod_inv.trim(),
        serie: equipo.serie?.trim() || 'S/N',
        marca: equipo.ma_marca?.descri?.trim() || 'S/M',
        modelo: equipo.modelo?.trim() || 'S/M',
        tipo: equipo.ma_clasif?.descri?.trim() || 'GENERICO',
        status: equipo.status?.trim() || 'A',
        ubicacion_actual: {
            empleado: ultimaAsignacion?.ma_emple?.descri?.trim() || 'SIN ASIGNAR',
            departamento: ultimaAsignacion?.ma_depar?.descri?.trim() || 'ALMACEN',
            f_movto: ultimaAsignacion?.f_movto,
            cve_alm: ultimaAsignacion?.cve_alm?.trim() || '999'
        }
    };
};

/**
 * Ejecuta un movimiento de inventario en una transacción.
 * Actualiza ma_eqasis y el status de ma_eqsis.
 */
exports.executeMovement = async (movementData) => {
    const { 
        cve_eqsis, 
        cve_emple, 
        cve_depar, 
        cve_alm, 
        new_status, 
        cve_usu_act 
    } = movementData;

    if (!cve_eqsis) {
        throw new BadRequestError('Faltan datos obligatorios para el movimiento.');
    }

    return prisma.$transaction(async (tx) => {
        // 1. Crear el registro en el historial (ma_eqasis)
        const newHistory = await tx.ma_eqasis.create({
            data: {
                cve_eqsis: parseInt(cve_eqsis),
                cve_emple: cve_emple ? parseInt(cve_emple) : null,
                cve_depar: cve_depar ? parseInt(cve_depar) : null,
                cve_alm: cve_alm || '999',
                f_movto: new Date(),
                // Nota: cve_usu_act es el usuario que realiza el cambio
            }
        });

        // 2. Actualizar el estatus en el maestro de equipos (ma_eqsis)
        if (new_status) {
            await tx.ma_eqsis.update({
                where: { clave: parseInt(cve_eqsis) },
                data: { status: new_status }
            });
        }

        return newHistory;
    });
};