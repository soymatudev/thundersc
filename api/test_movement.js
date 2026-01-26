const { PrismaClient } = require('./prisma/generated/prisma');
const prisma = new PrismaClient();

async function testMovement() {
    console.log('--- Probando Transacción de Movimiento ---');
    
    // 1. Buscar un equipo de prueba
    const equipo = await prisma.ma_eqsis.findFirst({
        where: { status: 'A' } // Disponible
    });

    if (!equipo) {
        console.log('No hay equipos disponibles para la prueba.');
        return;
    }

    console.log(`Equipo seleccionado: ${equipo.cod_inv} (Clave: ${equipo.clave})`);

    try {
        await prisma.$transaction(async (tx) => {
            console.log('Iniciando transacción...');
            
            // Crear historia
            const history = await tx.ma_eqasis.create({
                data: {
                    cve_eqsis: equipo.clave,
                    cve_emple: 1, // Empleado de prueba
                    cve_alm: '999',
                    f_movto: new Date()
                }
            });
            console.log('Historial creado:', history.clave);

            // Actualizar status
            await tx.ma_eqsis.update({
                where: { clave: equipo.clave },
                data: { status: 'U' } // En uso
            });
            console.log('Estatus actualizado a "U"');
        });
        console.log('TRANSACCIÓN COMPLETADA EXITOSAMENTE');
    } catch (error) {
        console.error('ERROR EN TRANSACCIÓN:', error.message);
    }

    // Verificar cambios
    const finalEquipo = await prisma.ma_eqsis.findUnique({ where: { clave: equipo.clave } });
    console.log(`Estatus final del equipo: ${finalEquipo.status}`);
}

testMovement()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
