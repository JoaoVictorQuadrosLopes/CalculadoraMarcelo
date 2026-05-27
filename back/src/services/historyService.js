const pool = require('../config/database');

async function buscarHistorico(usuarioId) {

    const resultado = await pool.query(
        `
        SELECT
            id,
            operacao,
            resultado,
            criado_em

        FROM historico

        WHERE usuario_id = $1

        ORDER BY criado_em DESC
        `,
        [usuarioId]
    );

    return resultado.rows;
}

module.exports = {
    buscarHistorico
};