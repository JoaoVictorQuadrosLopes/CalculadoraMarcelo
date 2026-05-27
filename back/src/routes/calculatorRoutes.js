const calculatorController =
    require('../controllers/calculatorController');

const authMiddleware =
    require('../middleware/authMiddleware');

async function calculatorRoutes(
    fastify
) {

    fastify.post(
        '/calcular',
        {
            preHandler: authMiddleware
        },
        calculatorController.calcular
    );
}

module.exports = calculatorRoutes;