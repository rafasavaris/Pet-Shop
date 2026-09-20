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

iniciar();