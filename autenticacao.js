require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);

function lerCookie(req, nome) {
    const cookies = req.headers.cookie || "";

    for(const cookie of cookies.split(";")) {
        const partes = cookie.trim().split("=");

        if(partes[0] === nome) {
            return decodeURIComponent(partes.slice(1).join("="));
        }
    }

    return null;
}

async function entrar(req, res) {
    const { email, senha } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if(error) {
        return res.render("login/login", {
            erro: "E-mail ou senha invalidos."
        });
    }

    res.cookie("admin_token", data.session.access_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });

    res.redirect("/painelAdmin");
}

async function verificarLogin(req, res, next) {
    const token = lerCookie(req, "admin_token");

    if(!token) {
        return res.redirect("/login");
    }

    const { data, error } = await supabase.auth.getUser(token);

    if(error || !data.user) {
        res.clearCookie("admin_token");
        return res.redirect("/login");
    }

    req.usuarioAdmin = data.user;
    next();
}

function sair(req, res) {
    res.clearCookie("admin_token");
    res.redirect("/login");
}

module.exports = { entrar, verificarLogin, sair };
