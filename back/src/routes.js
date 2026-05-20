const pool = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function verificarToken(request, reply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.code(401).send({
      erro: "Token não enviado."
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    request.usuario = usuario;
  } catch (erro) {
    return reply.code(401).send({
      erro: "Token inválido."
    });
  }
}

async function routes(fastify) {
  fastify.get("/teste-banco", async () => {
    const resultado = await pool.query("SELECT NOW()");

    return {
      mensagem: "Banco conectado com sucesso!",
      horario: resultado.rows[0].now
    };
  });

  fastify.post("/cadastro", async (request, reply) => {
    const { nome, email, senha } = request.body;

    if (!nome || !email || !senha) {
      return reply.code(400).send({
        erro: "Nome, email e senha são obrigatórios."
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    try {
      const resultado = await pool.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
        [nome, email, senhaCriptografada]
      );

      return {
        mensagem: "Usuário cadastrado com sucesso!",
        usuario: resultado.rows[0]
      };
    } catch (erro) {
      if (erro.code === "23505") {
        return reply.code(400).send({
          erro: "Esse email já está cadastrado."
        });
      }

      return reply.code(500).send({
        erro: "Erro ao cadastrar usuário."
      });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { email, senha } = request.body;

    if (!email || !senha) {
      return reply.code(400).send({
        erro: "Email e senha são obrigatórios."
      });
    }

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (resultado.rows.length === 0) {
      return reply.code(401).send({
        erro: "Email ou senha inválidos."
      });
    }

    const usuario = resultado.rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return reply.code(401).send({
        erro: "Email ou senha inválidos."
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    return {
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    };
  });

  fastify.post("/calcular", { preHandler: verificarToken }, async (request, reply) => {
    const { numero1, numero2, operador } = request.body;

    const n1 = Number(numero1);
    const n2 = Number(numero2);

    if (isNaN(n1) || isNaN(n2)) {
      return reply.code(400).send({
        erro: "Os números enviados são inválidos."
      });
    }

    let resultado;

    switch (operador) {
      case "+":
        resultado = n1 + n2;
        break;

      case "-":
        resultado = n1 - n2;
        break;

      case "*":
        resultado = n1 * n2;
        break;

      case "/":
        if (n2 === 0) {
          return reply.code(400).send({
            erro: "Não é possível dividir por zero."
          });
        }
        resultado = n1 / n2;
        break;

      default:
        return reply.code(400).send({
          erro: "Operador inválido. Use +, -, * ou /."
        });
    }

    const operacao = `${n1} ${operador} ${n2}`;

    const historico = await pool.query(
      "INSERT INTO historico (usuario_id, operacao, resultado) VALUES ($1, $2, $3) RETURNING id, operacao, resultado, criado_em",
      [request.usuario.id, operacao, resultado]
    );

    return {
      mensagem: "Cálculo realizado e salvo no histórico!",
      calculo: historico.rows[0]
    };
  });

  fastify.get("/historico", { preHandler: verificarToken }, async (request) => {
    const resultado = await pool.query(
      "SELECT id, operacao, resultado, criado_em FROM historico WHERE usuario_id = $1 ORDER BY criado_em DESC",
      [request.usuario.id]
    );

    return {
      usuario: request.usuario.nome,
      historico: resultado.rows
    };
  });
}

module.exports = routes;