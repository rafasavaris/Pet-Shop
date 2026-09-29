const express = require("express");
const { engine } = require("express-handlebars");

const {
  iniciarBD,
  getBD,
  iniciarAgenda,
} = require("./mongodb.js");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const PORT = 3000;

app.get("/", (req, res) => {
  res.render("public/index", {layout: false});
});

app.get("/admin", async (req, res) => {
  res.render("admin/adminHome", { layout: false });
});
app.get("/listaPetAgenda", async (req, res) => {
  const BD = getBD();

  const agendamentos = await BD.collection("agendamentos").find({}).toArray();

  let tabela = "";

  for (let i = 0; i < agendamentos.length; i++) {
    tabela +=
      "<tr> <td>" +
      agendamentos[i].data +
      "</td>" +
      "<td>" +
      agendamentos[i].hora +
      "</td>" +
      "<td>" +
      agendamentos[i].nome +
      "</td>" +
      "<td>" +
      agendamentos[i].telefone +
      "</td> </tr>";
  }
  res.render("admin/listaAgenda", { tabela });
});

app.post("/ajustaPetAgenda", async (req, res) => {
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

  res.redirect("/ajustaPetAgenda?salvo=1");
});

app.get("/ajustaPetAgenda", async (req, res) => {
  const BD = getBD();
  let configuracoes = await BD.collection("agenda").find({}).toArray();

  res.render("admin/ajustaAgenda", { 
    configuracoes,
  salvo: req.query.salvo === "1", });
  });

app.get("/agendamento", async (req, res) => {
    res.render("cliente/agendamento", {
      cadastrado: req.query.cadastrado === "1",
    });
  });

app.get("/verAgenda", async (req, res) => {
  res.render("cliente/verAgenda");
});

app.post("/agendamento", async (req, res) => {
  let { nome, telefone, cpf, endereco, nome_do_pet, servico, data, hora } = req.body;

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

  if (agendamentos.length >= quantidadeMaxima){
    return res.send("Esse horário já está lotado.");
  }

  let registro = {};
  registro.nome = nome;
  registro.cpf = cpf;
  registro.telefone = telefone;
  registro.endereco = endereco;
  registro.nome_do_pet = nome_do_pet;
  registro.servico = servico;
  registro.data = data;
  registro.hora = hora;

  await BD.collection("agendamentos").insertOne(registro);

  res.redirect("/agendamento?cadastrado=1");
});

async function iniciarServidor() {
  await iniciarBD();
  await iniciarAgenda();
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
