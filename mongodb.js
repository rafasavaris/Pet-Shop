const { MongoClient } = require("mongodb");

const cliente = new MongoClient("mongodb://localhost:50000");

let BD;

async function iniciarBD() {
    await cliente.connect();

    BD = cliente.db("petshop");
    console.log("Mongo DB conectado!");
}

async function iniciarAgenda() {
    const BD = getBD();
    const quantidade = await BD.collection("agenda").find({}).toArray();

    if(quantidade.length === 0) {
        const horarios = ["08", "09", "10", "11", "14", "15", "16", "17"];
        const configuracoes = [];

        for(let i = 0; i < horarios.length; i++) {
            configuracoes.push({
                horario: horarios[i],
                segunda: 0,
                terca: 0,
                quarta: 0,
                quinta: 0,
                sexta: 0,
                sabado: 0
            });
        }
        await BD.collection("agenda").insertMany(configuracoes);
        console.log("Agenda inicial criada!");
    }
}

function getBD() {
    return BD;
}

module.exports = { iniciarBD, getBD, iniciarAgenda };
