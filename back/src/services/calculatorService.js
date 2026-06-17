const pool = require('../config/database');

function calcularResultado(
    numero1,
    numero2,
    operador
) {

    switch (operador) {

    case '+':
        return numero1 + numero2;

    case '-':
        return numero1 - numero2;

    case '*':
        return numero1 * numero2;

    case '/':

        if (numero2 === 0) {
            throw new Error(
                'Divisão por zero'
            );
        }
        return numero1 / numero2;
        
    case '^':
        return Math.pow(numero1, numero2);

    case 'sqrt':

        if (numero1 < 0) {
            throw new Error(
                'Raiz de número negativo'
            );
        }

        return Math.sqrt(numero1);
    
    case "root":
        if (numero === 0) {
            throw new Error(
                'Índice da raiz não pode ser zero'
            );
        }
        if (numero1 < 0 && numero2 % 2 === 0) {
            throw new Error(
                'Raiz de número negativo'
            );
        }
        if (numero1 < 0) {
            return -Math.pow(Math.abs(numero1), 1 / numero2);
        }
        return Math.pow(numero1, 1 / numero2);


    default:

        throw new Error(
            'Operador inválido'
        );
}
}

async function salvarCalculo(
    usuarioId,
    operacao,
    resultado
) {

    const historico = await pool.query(
        `
        INSERT INTO historico
        (
            usuario_id,
            operacao,
            resultado
        )

        VALUES ($1, $2, $3)

        RETURNING
            id,
            operacao,
            resultado,
            criado_em
        `,
        [
            usuarioId,
            operacao,
            resultado
        ]
    );

    return historico.rows[0];
}

module.exports = {
    calcularResultado,
    salvarCalculo
};