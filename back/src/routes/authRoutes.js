const bcrypt = require('bcrypt');
const pool = require('../db/database');

async function routes(fastify, options) {

    fastify.post('/register', async (request, reply) => {

        const { username, password } = request.body;

        const hash = await bcrypt.hash(password, 10);

        try {

            await pool.query(
                'INSERT INTO users(username, password) VALUES($1, $2)',
                [username, hash]
            );

            reply.send({
                message: 'Usuário criado'
            });

        } catch (err) {

            reply.code(400).send({
                error: 'Usuário já existe'
            });

        }
    });

    fastify.post('/login', async (request, reply) => {

        const { username, password } = request.body;

        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        const user = result.rows[0];

        if (!user) {
            return reply.code(401).send({
                error: 'Usuário não encontrado'
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return reply.code(401).send({
                error: 'Senha inválida'
            });
        }

        const token = fastify.jwt.sign({
            id: user.id,
            username: user.username
        });

        reply.send({ token });
    });
}

module.exports = routes;