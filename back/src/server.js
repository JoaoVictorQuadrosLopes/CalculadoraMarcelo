require('dotenv').config();

const fastify = require('fastify')({
    logger: true
});

const cors = require('@fastify/cors');

const pool = require('./db/database');

fastify.register(cors, {
    origin: true
});

fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET
});

fastify.register(require('./routes/authRoutes'));

pool.query('SELECT NOW()')
    .then(res => {
        console.log('Postgres conectado');
        console.log(res.rows);
    })
    .catch(err => {
        console.log(err);
    });

fastify.get('/', async () => {
    return {
        message: 'API funcionando'
    };
});

const start = async () => {

    try {

        await fastify.listen({
            port: process.env.PORT,
            host: '0.0.0.0'
        });

        console.log('Servidor rodando');

    } catch (err) {

        fastify.log.error(err);
        process.exit(1);
    }
};

start();