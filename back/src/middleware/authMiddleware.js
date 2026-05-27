const jwt = require('jsonwebtoken');

async function authMiddleware(request, reply) {

    const authHeader =
        request.headers.authorization;

    if (!authHeader) {

        return reply.code(401).send({
            erro: 'Token não enviado'
        });
    }

    const token =
        authHeader.replace('Bearer ', '');

    try {

        const usuario =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        request.usuario = usuario;

    } catch {

        return reply.code(401).send({
            erro: 'Token inválido'
        });
    }
}

module.exports = authMiddleware;