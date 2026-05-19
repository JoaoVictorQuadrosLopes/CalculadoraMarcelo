async function auth(request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({
            error: 'Token inválido'
        });
    }
}

module.exports = auth;