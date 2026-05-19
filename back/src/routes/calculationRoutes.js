const pool = require('../db/database');
const auth = require('../middleware/auth');

async function routes(fastify, options) {

    fastify.post('/calculate', {
        preHandler: [auth]
    }, async (request, reply) => {

        const { a, b, operation } = request.body;

        let result;

        switch (operation) {

            case '+':
                result = a + b;
                break;

            case '-':
                result = a - b;
                break;

            case '*':
                result = a * b;
                break;

            case '%':
                result = a % b;
                break;

            default:
                return reply.code(400).send({
                    error: 'Operação inválida'
                });
        }

        const expression = `${a} ${operation} ${b}`;

        await pool.query(
            `INSERT INTO calculations
            (user_id, expression, result)
            VALUES ($1, $2, $3)`,
            [
                request.user.id,
                expression,
                result.toString()
            ]
        );

        reply.send({
            expression,
            result
        });
    });

    fastify.get('/history', {
        preHandler: [auth]
    }, async (request, reply) => {

        const result = await pool.query(
            `SELECT *
             FROM calculations
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [request.user.id]
        );

        reply.send(result.rows);
    });
}

module.exports = routes;