const express = require("express");
const { engine } = require("express-handlebars");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const cliente = new MongoClient("mongodb://localhost:50000");

let BD;
let agendamentos;
let agenda;
const PORT = 3000;

async function iniciar() {
  await cliente.connect();

  BD = cliente.db("petshop");
  agendamentos = BD.collection("agendamentos");
  agenda = BD.collection("agenda");

  console.log("Mongo DB conectado!");

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

app.get("/", async (req, res) => {
  res.render("public/index");
});

app.get("/agendamento", async (req, res) => {
  res.render("cliente/agendamento");
});

app.post("/agendamento", async (req, res) => {
  let { nome, telefone, endereco, nome_do_pet, servico, data, hora } = req.body;

  let registro = {};
  registro.nome = nome;
  registro.telefone = telefone;
  registro.endereco = endereco;
  registro.nome_do_pet = nome_do_pet;
  registro.servico = servico;
  registro.data = data;
  registro.hora = hora;

  await agendamentos.insertOne(registro);
  res.send("Agendamento realizado com sucesso!");
});

iniciar();
