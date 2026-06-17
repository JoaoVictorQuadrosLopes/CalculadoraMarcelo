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

async function buscarRankingOperacoes(usuarioId) {

    const resultado = await pool.query(
        `
        SELECT
            tipo_operacao,
            COUNT(*)::int AS total

        FROM (
            SELECT
                CASE
                    WHEN operacao LIKE '% + %' THEN 'Soma (+)'
                    WHEN operacao LIKE '% - %' THEN 'Subtracao (-)'
                    WHEN operacao LIKE '% * %' THEN 'Multiplicacao (*)'
                    WHEN operacao LIKE '% / %' THEN 'Divisao (/)'
                    ELSE 'Raiz quadrada'
                END AS tipo_operacao

            FROM historico

            WHERE usuario_id = $1
        ) operacoes

        GROUP BY tipo_operacao

        ORDER BY
            total DESC,
            tipo_operacao ASC
        `,
        [usuarioId]
    );

    return resultado.rows;
}

module.exports = {
    buscarHistorico,
    buscarRankingOperacoes
};
