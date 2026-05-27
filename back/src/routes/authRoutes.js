const authController =
    require('../controllers/authController');

async function authRoutes(fastify) {

    fastify.post(
        '/cadastro',
        authController.cadastro
    );

    fastify.post(
        '/login',
        authController.login
    );
}

module.exports = authRoutes;