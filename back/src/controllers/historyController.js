const historyService =
    require('../services/historyService');

async function listarHistorico(
    request,
    reply
) {

    try {

        const historico =
            await historyService.buscarHistorico(
                request.usuario.id
            );

        reply.send({
            usuario: request.usuario.nome,
            historico
        });

    } catch (erro) {

        reply.code(500).send({
            erro: 'Erro ao buscar histórico'
        });
    }
}

module.exports = {
    listarHistorico
};