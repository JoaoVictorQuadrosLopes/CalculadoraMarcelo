const calculatorService =
    require('../services/calculatorService');

async function calcular(
    request,
    reply
) {

    try {

        const {
            numero1,
            numero2,
            operador
        } = request.body;

        const n1 = Number(numero1);
        const n2 = Number(numero2);

        const resultado =
            calculatorService.calcularResultado(
                n1,
                n2,
                operador
            );

        let operacao;

            if (operador === 'sqrt') {


                operacao = `√(${n1})`;

            } else if (operador === 'log') {

                operacao = `log(${n1})`;

            } else {

                operacao =
                `${n1} ${operador} ${n2}`;
            }

        const historico =
            await calculatorService.salvarCalculo(
                request.usuario.id,
                operacao,
                resultado
            );

        reply.send({
            mensagem:
                'Cálculo realizado',
            calculo: historico
        });

    } catch (erro) {

        reply.code(400).send({
            erro: erro.message
        });
    }
}

module.exports = {
    calcular
};