import pool from "../bd/db.js";
import { google } from "googleapis";

// Verifica si el objeto esta vacio
function isEmptyObject(obj) {
    return !Object.keys(obj) || Object.keys(obj).length === 0;
}

// Construir mensaje MIME con Subject UTF-8
function encodeRFC2047(str) {
    return '=?UTF-8?B?' + Buffer.from(String(str), 'utf8').toString('base64') + '?=';
}

// Cargar credenciales de Google Cloud
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// 1. Generar URL de autorización
const googleLogin = (_, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/gmail.send"],
    });
    res.redirect(authUrl);
};

// 2. Callback para recibir el code y obtener tokens
const googleCallback = async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Muestra token en consola
        console.log("Refresh token:", tokens.refresh_token);

        res.send("Autenticación exitosa, refresh_token guardado.");
    } catch (err) {
        console.error("Error al obtener tokens:", err);
        res.status(500).send("Error en autenticación");
    }
};

// 3. Enviar correo usando Gmail API
const emailSend = async (req, res) => {
    try {
        // Construir mensaje MIME
        const { para, asunto, mensaje } = req.body;
        const de = "emprendimiento2020g7h2@gmail.com";
        const message = [
            `From: ${de}`,
            `To: ${para}`,
            `Subject: ${encodeRFC2047(asunto)}`,
            "MIME-Version: 1.0",
            "Content-Type: text/plain; charset=\"UTF-8\"",
            "Content-Transfer-Encoding: 7bit",
            "",
            mensaje || ""
        ].join("\r\n");

        // Configurar con refresh_token desde .env
        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

        // Consulta el correo electrónico en BD
        const sql = "SELECT * FROM usuarios WHERE correo = ?";
        const [rows] = await pool.query(sql, [to]);
        if (isEmptyObject(rows)) {
            return res.status(404).send("Error correo no encontrado");
        }

        // Codificar en Base64URL
        const encodedMessage = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // Enviar
        const result = await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw: encodedMessage },
        });

        res.json({ status: "Correo enviado", data: result.data });
    } catch (err) {
        console.error("Error al enviar correo:", err);
        res.status(500).send("Error al enviar correo");
    }
};

// 4. Enviar comentario usando Gmail API
const feedbackSend = async (req, res) => {
    try {
        // Construir mensaje MIME
        const { asunto, mensaje } = req.body;
        const mi = "emprendimiento2020g7h2@gmail.com"
        const message = [
            `From: ${mi}`,
            `To: ${mi}`,
            `Subject: ${encodeRFC2047(asunto)}`,
            "MIME-Version: 1.0",
            "Content-Type: text/plain; charset=\"UTF-8\"",
            "Content-Transfer-Encoding: 7bit",
            "",
            mensaje || ""
        ].join("\r\n");
        
        // Configurar con refresh_token desde .env
        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

        // Codificar en Base64URL
        const encodedMessage = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // Enviar
        const result = await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw: encodedMessage },
        });

        res.json({ status: "Comentario enviado", data: result.data });
    } catch (err) {
        console.error("Error al enviar comentario:", err);
        res.status(500).send("Error al enviar comentario");
    }
};

export {
    googleLogin,
    googleCallback,
    emailSend,
    feedbackSend
};