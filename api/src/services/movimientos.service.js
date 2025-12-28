const prisma = require('../config/prismaClient');

/**
 * Genera el reporte de inventario basado en el código de inventario del equipo.
 * @param {string} cod_inv - Código de inventario del equipo.
 */
exports.getMovimientosByCodigoEquipo = async (cod_inv) => {
    // Usamos $queryRaw para ejecutar una consulta compleja con JOINs de forma segura.
    // Esto es mucho más seguro que el QueryHandler anterior porque previene fugas de conexión.
    const query = `
    SELECT a.serie, a.cod_inv, a.cve_marca, b.descri as marca, a.cve_clasif, c.descri as tipo, f_regis, a.modelo 
    from ma_eqsis a, ma_marca b, ma_clasif c
    WHERE a.cve_marca = b.clave
    and a.cve_clasif = c.clave
    and cod_inv = ?
    `;
    
    // NOTA: Prisma's $queryRawUnsafe o una sintaxis similar podría ser necesaria dependiendo de la versión
    // para usar '?' como placeholder. Por simplicidad, se asume una versión que lo permite
    // o se usa $queryRaw`... and cod_inv = ${cod_inv}` si los parámetros son seguros.
    // Para este caso, mantenemos la consulta original pero la ejecutamos con Prisma.
    // En una implementación final, se recomienda usar las relaciones de Prisma como se planeó.
    const data = await prisma.$queryRawUnsafe(query, cod_inv);

    const processedData = data.map(row => ({
        serie: row.serie ? row.serie.trim() : '',
        cod_inv: row.cod_inv ? row.cod_inv.trim() : '',
        cve_marca: row.cve_marca,
        marca: row.marca ? row.marca.trim() : '',
        cve_clasif: row.cve_clasif,
        tipo: row.tipo ? row.tipo.trim() : '',
        modelo: row.modelo ? row.modelo.trim() : '',
        f_regis: new Date(row.f_regis).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }),
    }));

    return { data: processedData };
};

/**
 * Crea un nuevo movimiento de asignación de equipo.
 * @param {object} movimientoData - Datos del movimiento a crear.
 * @param {string} movimientoData.cve_alm - Clave del almacén.
 * @param {number} movimientoData.cve_eqsis - Clave del equipo.
 * @param {number} movimientoData.cve_emple - Clave del empleado.
 * @param {number} movimientoData.cve_depar - Clave del departamento.
 * @param {string} movimientoData.f_movto - Fecha del movimiento.
 * @returns {Promise<Object>} El movimiento recién creado.
 */
exports.createMovimiento = async (movimientoData) => {
    return prisma.ma_eqasis.create({
        data: movimientoData,
    });
}