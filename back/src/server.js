require('dotenv').config();

const fastify = require('fastify')({
    logger: true
});

const cors = require('@fastify/cors');

fastify.register(cors, {
    origin: true
});

fastify.register(
    require('./routes/authRoutes')
);

fastify.register(
    require('./routes/calculatorRoutes')
);

fastify.register(
    require('./routes/historyRoutes')
);

fastify.listen({
    port: process.env.PORT,
    host: '0.0.0.0'
});