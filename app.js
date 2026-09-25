const express = require("express");
const { engine } = require("express-handlebars");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const cliente = new MongoClient("mongodb://localhost:50000");

let BD;
const PORT = 3000;

async function iniciar() {
    await cliente.connect();

    BD = cliente.db("petshop");
    console.log("Mongo DB conectado!");
    
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

app.get("/", async (req, res) => {
  res.render("public/index")
})

app.get("/admin", async (req, res) => {
    res.render("admin/adminHome")
})

app.get("/listaPetAgenda", async (req, res) => {
    res.render("admin/listaAgenda")
})

app.get("/ajustaPetAgenda", async (req, res) => {
    res.render("admin/ajustaAgenda")
})

iniciar();