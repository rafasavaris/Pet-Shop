const express = require("express");
const { engine } = require("express-handlebars");

const { iniciarBD, getBD, iniciarAgenda } = require("./mongodb.js");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded( { extended: true }));

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

app.post("/ajustaPetAgenda", async (req, res) => {
    const BD = getBD();
    const horarios = ["08", "09", "10", "11", "14", "15", "16", "17"];
    const configuracoes = [];

    for(let i = 0; i < horarios.length; i++) {
        const horario = horarios[i];

        configuracoes.push({
            horario: horario,
            segunda: Number(req.body["seg" + horario]),
            terca: Number(req.body["ter" + horario]),
            quarta: Number(req.body["qua" + horario]),
            quinta: Number(req.body["qui" + horario]),
            sexta: Number(req.body["sex" + horario]),
            sabado: Number(req.body["sab" + horario])
        })
    };

    await BD.collection("agenda").deleteMany({});
    await BD.collection("agenda").insertMany(configuracoes);

    res.redirect("/ajustaPetAgenda");
});

app.get("/ajustaPetAgenda", async (req, res) => {
    const BD = getBD();
    let configuracoes = await BD.collection("agenda").find({}).toArray();

    res.render("admin/ajustaAgenda", { configuracoes })
});

async function iniciarServidor() {
    await iniciarBD();
    await iniciarAgenda();
};

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

iniciarServidor();