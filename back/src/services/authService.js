const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../config/database');

async function cadastrarUsuario(
    nome,
    email,
    senha
) {

    const senhaCriptografada =
        await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
        `
        INSERT INTO usuarios
        (nome, email, senha)

        VALUES ($1, $2, $3)

        RETURNING id, nome, email
        `,
        [nome, email, senhaCriptografada]
    );

    return resultado.rows[0];
}

async function loginUsuario(
    email,
    senha
) {

    const resultado = await pool.query(
        `
        SELECT * FROM usuarios
        WHERE email = $1
        `,
        [email]
    );

    const usuario = resultado.rows[0];

    if (!usuario) {
        throw new Error('Usuário inválido');
    }

    const senhaCorreta =
        await bcrypt.compare(
            senha,
            usuario.senha
        );

    if (!senhaCorreta) {
        throw new Error('Usuário inválido');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '2h'
        }
    );

    return {
        token,
        usuario
    };
}

module.exports = {
    cadastrarUsuario,
    loginUsuario
};