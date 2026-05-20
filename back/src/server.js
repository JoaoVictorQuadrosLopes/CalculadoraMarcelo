const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const routes = require("./routes");

fastify.register(cors, {
  origin: "*"
});

fastify.register(routes);

fastify.get("/", async () => {
  return { mensagem: "Servidor da calculadora online rodando!" };
});

const iniciarServidor = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Servidor rodando em http://localhost:3000");
  } catch (erro) {
    fastify.log.error(erro);
    process.exit(1);
  }
};

iniciarServidor();