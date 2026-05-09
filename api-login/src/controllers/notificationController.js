import pool from "../bd/db.js";
import admin from "firebase-admin";

// Inicializar Firebase Admin una sola vez
let appInitialized = false;
function environment() {
  if (!appInitialized) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    appInitialized = true;
  }
}

// Verifica si el objeto esta vacio
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

// Enviar notificacion push a usuario
const sendNotification = async function (req, res) {
  try {
    const { userId, token, title, body } = req.body;

    // Inicializar entorno Firebase
    environment();

    // Enviar notificación push
    const message = {
      notification: { title, body },
      token
    };
    await admin.messaging().send(message);

    // Guardar notificacion en la tabla 'notificaciones'
    const now = new Date();
    const date = now.toISOString().slice(0, 19).replace('T', ' ');
    const notificacion = { mensaje: `${title}: ${body}`, fecha: date, usuario_id: userId };
    await pool.query("INSERT INTO notificaciones SET ?", notificacion);

    res.status(200).send("Notificación enviada correctamente");
  } catch (error) {
    console.error("Error al enviar notificación: ", error);
    res.status(500).send("Error del servidor");
  }
}

// Seleccionar notificaciones del usuario
const selectNotification = async function (req, res) {
  try {
    const { userId, maxRows } = req.query;

    // Consulta para obtener los pagos del usuario
    let sql = "SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY fecha DESC";
    let params = [userId];

    if (maxRows) {
      sql += " LIMIT ?";
      params.push(Number(maxRows));
    }

    const [rows] = await pool.query(sql, params);

    if (isEmptyObject(rows)) {
      return res.status(404).send("Error notificaciones de usuario no encontradas");
    }

    res.status(200).send(rows);
  } catch (error) {
    console.error("Error al seleccionar notificaciones de usuario: ", error);
    res.status(500).send("Error del servidor");
  }
}

export {
  sendNotification,
  selectNotification
};