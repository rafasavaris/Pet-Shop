const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

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

async function iniciarUsuarios() {
    const BD = getBD();
    const usuarios = BD.collection("usuarios");

    await usuarios.createIndex({ usuario: 1 }, { unique: true });

    const existeUsuario = await usuarios.countDocuments({}, { limit: 1 });

    if (existeUsuario > 0) {
        return;
    }

    const usuario = process.env.ADMIN_USUARIO?.trim().toLowerCase();
    const senha = process.env.ADMIN_SENHA;

    if (!usuario || !senha) {
        console.warn(
            "Nenhum administrador cadastrado. Defina ADMIN_USUARIO e ADMIN_SENHA no .env e reinicie a aplicação."
        );
        return;
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await usuarios.insertOne({
        usuario,
        senhaHash,
        perfil: "admin",
        ativo: true,
        criadoEm: new Date()
    });

    console.log("Administrador inicial criado com sucesso.");
}

function getBD() {
    return BD;
}

module.exports = {
    iniciarBD,
    getBD,
    iniciarAgenda,
    iniciarUsuarios
};
