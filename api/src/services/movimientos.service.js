const QueryHandler = require('../utils/QueryHandler');
const Logger = require('../utils/Logger');

/**
 * Genera el reporte de inventario basado en filtros.
 * @param {object} filters - Objeto con los filtros para la consulta.
 * @param {string} [filters.cod_inv] - Clave del almacén.
 */
exports.getMovimientosByCodigoEquipo = async (cod_inv) => {
    try {
        let query = `
        SELECT a.serie, a.cod_inv, a.cve_marca, b.descri as marca, a.cve_clasif, c.descri as tipo, f_regis, a.modelo 
        from ma_eqsis a, ma_marca b, ma_clasif c
        WHERE a.cve_marca = b.clave
        and a.cve_clasif = c.clave
        and cod_inv = ?
        `;

        Logger.info('Executing query for inventory report with filters', { query, cod_inv });
        const data = await QueryHandler.execute(query, [cod_inv], 'main');

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
    } catch (error) {
        Logger.error(`Error generating inventory report: ${error.message}`);
        throw new Error('Failed to generate inventory report.');
    }
};

/**
 * @param {object} movimientoData - Datos del movimiento a crear.
 * @param {string} movimientoData.cve_alm - Clave del almacén.
 * @param {number} movimientoData.cve_eqsis - Clave del equipo.
 * @param {number} movimientoData.cve_emple - Clave del empleado.
 * @param {number} movimientoData.cve_depar - Clave del departamento.
 * @param {string} movimientoData.f_movto - Fecha del movimiento.
 *  */
exports.createMovimiento = async (movimientoData) => {
    try {
        const sql = `
        INSERT INTO ma_eqasis (cve_alm, cve_eqsis, cve_emple, cve_depar, f_movto)
        VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            movimientoData.cve_alm,
            movimientoData.cve_eqsis,
            movimientoData.cve_emple,
            movimientoData.cve_depar,
            movimientoData.f_movto
        ];

        Logger.info('Inserting new movimiento with data', { movimientoData });
        const result = await QueryHandler.execute(sql, params, 'main');

        const newMovimiento = {
            clave: result.insertId,
            ...movimientoData
        };

        return newMovimiento;
    } catch (error) {
        Logger.error(`Error creating movimiento: ${error.message}`);
        throw new Error('Failed to create movimiento.');
    }
}