const express = require("express");
const { engine } = require("express-handlebars");

const { iniciarBD, getBD } = require("./mongodb.js");

const app = express();

app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const PORT = 3000;

app.get("/", async (req, res) => {
  res.render("public/index")
})

app.get("/admin", async (req, res) => {
    res.render("admin/adminHome")
})

app.get("/listaPetAgenda", async (req, res) => {
    const BD = getBD();

    const agendamentos = await BD.collection("agendamentos").find({}).toArray();

    let tabela = '';

    for(let i = 0; i < agendamentos.length; i++) {
        tabela += "<tr> <td>" + agendamentos[i].data + "</td>" +  
                 "<td>" + agendamentos[i].horario + "</td>" +
                 "<td>" + agendamentos[i].nomeCliente + "</td>" +
                 "<td>" + agendamentos[i].cpf + "</td> </tr>"
    }
    res.render("admin/listaAgenda", { tabela })
})

app.post()

app.get("/ajustaPetAgenda", async (req, res) => {
    res.render("admin/ajustaAgenda")
})

iniciarBD();

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});