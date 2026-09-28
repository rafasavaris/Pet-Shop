require("dotenv").config();

const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const {
  iniciarBD,
  getBD,
  iniciarAgenda,
  iniciarUsuarios,
} = require("./mongodb.js");

const app = express();

const segredoSessao =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.SESSION_SECRET) {
  console.warn(
    "SESSION_SECRET não definido. As sessões serão encerradas quando o servidor reiniciar.",
  );
}

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "petshop.sid",
    secret: segredoSessao,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:50000",
      dbName: "petshop",
      collectionName: "sessoes",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    },
  }),
);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const PORT = 3000;

function exigirAdmin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }

  if (req.session.usuario.perfil !== "admin") {
    return res.status(403).send("Acesso negado.");
  }

  next();
}

function regenerarSessao(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((erro) => (erro ? reject(erro) : resolve()));
  });
}

function salvarSessao(req) {
  return new Promise((resolve, reject) => {
    req.session.save((erro) => (erro ? reject(erro) : resolve()));
  });
}

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/admin");
  }

  res.render("auth/login", {
    layout: false,
    titulo: "Login administrativo",
  });
});

app.post("/login", async (req, res, next) => {
  try {
    const usuarioInformado = String(req.body.usuario || "")
      .trim()
      .toLowerCase();
    const senhaInformada = String(req.body.senha || "");

    const usuario = await getBD()
      .collection("usuarios")
      .findOne({
        usuario: usuarioInformado,
        ativo: { $ne: false },
      });

    const senhaCorreta = usuario
      ? await bcrypt.compare(senhaInformada, usuario.senhaHash)
      : false;

    if (!usuario || !senhaCorreta) {
      return res.status(401).render("auth/login", {
        layout: false,
        titulo: "Login administrativo",
        erro: "Usuário ou senha inválidos.",
        usuario: usuarioInformado,
      });
    }

    await regenerarSessao(req);
    req.session.usuario = {
      id: usuario._id.toString(),
      nome: usuario.usuario,
      perfil: usuario.perfil,
    };
    await salvarSessao(req);

    res.redirect("/admin");
  } catch (erro) {
    next(erro);
  }
});

app.post("/logout", (req, res, next) => {
  req.session.destroy((erro) => {
    if (erro) {
      return next(erro);
    }

    res.clearCookie("petshop.sid");
    res.redirect("/login");
  });
});

app.get("/admin", exigirAdmin, async (req, res) => {
  res.render("auth/painel", {
    layout: false,
    titulo: "Área administrativa",
    usuario: req.session.usuario.nome,
  });
});

app.get("/listaPetAgenda", exigirAdmin, async (req, res) => {
  const BD = getBD();

  const agendamentos = await BD.collection("agendamentos").find({}).toArray();

  res.render("admin/listaAgenda", { agendamentos });
});

app.post("/ajustaPetAgenda", exigirAdmin, async (req, res) => {
  const BD = getBD();
  const horarios = ["08", "09", "10", "11", "14", "15", "16", "17"];
  const configuracoes = [];

  for (let i = 0; i < horarios.length; i++) {
    const horario = horarios[i];

    configuracoes.push({
      horario: horario,
      segunda: Number(req.body["seg" + horario]),
      terca: Number(req.body["ter" + horario]),
      quarta: Number(req.body["qua" + horario]),
      quinta: Number(req.body["qui" + horario]),
      sexta: Number(req.body["sex" + horario]),
      sabado: Number(req.body["sab" + horario]),
    });
  }

  await BD.collection("agenda").deleteMany({});
  await BD.collection("agenda").insertMany(configuracoes);

  res.redirect("/ajustaPetAgenda");
});

app.get("/ajustaPetAgenda", exigirAdmin, async (req, res) => {
  const BD = getBD();
  let configuracoes = await BD.collection("agenda").find({}).toArray();

  res.render("admin/ajustaAgenda", { configuracoes });
});

app.get("/agendamento", async (req, res) => {
  res.render("cliente/agendamento");
});

app.post("/agendamento", async (req, res) => {
  let { nome, telefone, endereco, nome_do_pet, servico, data, hora } = req.body;

  const dataHoraEscolhida = new Date(data + "T" + hora + ":00");

  if (dataHoraEscolhida <= new Date()) {
    return res.send(
      "Não é possível realizar um agendamento para um horário que já passou.",
    );
  }

  const BD = getBD();

  const diaSemana = dataHoraEscolhida.getDay();

  const diasSemana = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const dia = diasSemana[diaSemana];

  const configuracao = await BD.collection("agenda").findOne({
    horario: hora,
  });

  const quantidadeMaxima = configuracao[dia];

  const agendamentos = await BD.collection("agendamentos")
    .find({
      data: data,
      hora: hora,
    })
    .toArray();

  if (agendamentos.length >= quantidadeMaxima) {
    return res.send("Esse horário já está lotado.");
  }

  let registro = {};
  registro.nome = nome;
  registro.telefone = telefone;
  registro.endereco = endereco;
  registro.nome_do_pet = nome_do_pet;
  registro.servico = servico;
  registro.data = data;
  registro.hora = hora;

  await BD.collection("agendamentos").insertOne(registro);

  res.send("Agendamento realizado com sucesso!");
});

async function iniciarServidor() {
  await iniciarBD();
  await iniciarAgenda();
  await iniciarUsuarios();
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get("/horarios-disponiveis", async (req, res) => {
  const BD = getBD();

  const data = req.query.data;

  const dataEscolhida = new Date(data + "T00:00:00");
  const diaSemana = dataEscolhida.getDay();

  const diasSemana = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const dia = diasSemana[diaSemana];

  const configuracoes = await BD.collection("agenda")
    .find({ [dia]: { $gt: 0 } })
    .toArray();

  const agendamentos = await BD.collection("agendamentos")
    .find({ data: data })
    .toArray();

  const horariosDisponiveis = [];

  for (let i = 0; i < configuracoes.length; i++) {
    const horario = configuracoes[i].horario;
    const quantidadeMaxima = configuracoes[i][dia];

    let quantidadeAgendada = 0;

    for (let j = 0; j < agendamentos.length; j++) {
      if (agendamentos[j].hora === horario) {
        quantidadeAgendada++;
      }
    }

    if (quantidadeAgendada < quantidadeMaxima) {
      horariosDisponiveis.push(horario);
    }
  }

  res.json(horariosDisponiveis);
});

iniciarServidor();
