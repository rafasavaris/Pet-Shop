const { MongoClient } = require("mongodb");

const cliente = new MongoClient("mongodb://localhost:50000");

let BD;

async function iniciarBD() {
    await cliente.connect();

    BD = cliente.db("petshop");
    console.log("Mongo DB conectado!");
}

function getBD() {
    return BD;
}

module.exports = { iniciarBD, getBD };
