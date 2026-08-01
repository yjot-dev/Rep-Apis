import pool from "../bd/db.js";
import { google } from "googleapis";

// Verifica si el objeto esta vacio
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

// Utilidad para formatear a fecha local string
function toLocalString(d) {
  const date = new Date(d);
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 19).replace('T', ' ');
}

// Validar compra de Google Play
const validatePayment = async function (req, res) {
  try {
    const { purchaseToken, productId, userId, amount, money, date } = req.body;

    if (!purchaseToken || !productId || !userId) {
      return res.status(400).send("Faltan parámetros requeridos");
    }

    // 1. Verificar primero si el token ya existe en DB para ahorrar llamadas a la API
    const sql1 = "SELECT id FROM pagos WHERE purchase_token = ?";
    const [existingToken] = await pool.query(sql1, [purchaseToken]);

    if (existingToken.length > 0) {
      return res.status(409).send("Token de compra ya procesado");
    }

    // 2. Autenticación con Google API
    const serviceAccount = JSON.parse(process.env.GPB_SERVICE_ACCOUNT);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\n/g, '\n');
    }
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/androidpublisher"],
    });

    const androidPublisher = google.androidpublisher({
      version: "v3",
      auth: auth,
    });

    // 3. Validar compra con Google Play
    const response = await androidPublisher.purchases.products.get({
      packageName: process.env.GPB_PACKAGE_NAME,
      productId: productId,
      token: purchaseToken,
    });

    const purchaseData = response.data;

    // 4. Verificar si la compra es válida
    if (purchaseData.purchaseState === 0) {

      // 5. RECONOCER LA COMPRA (Obligatorio para que Google no la reembolse)
      if (purchaseData.acknowledgementState === 0) {
        await androidPublisher.purchases.products.acknowledge({
          packageName: process.env.GPB_PACKAGE_NAME,
          productId: productId,
          token: purchaseToken,
        });
      }

      // 6. Guardar en Base de Datos
      const pagoNuevo = {
        monto: amount,
        moneda: money,
        fecha: date ? toLocalString(date) : toLocalString(new Date(parseInt(purchaseData.purchaseTimeMillis))),
        estado: purchaseData.purchaseState,
        purchase_token: purchaseToken,
        usuario_id: userId
      };

      const sql2 = "INSERT INTO pagos SET ?";
      await pool.query(sql2, pagoNuevo);

      return res.status(200).json({ message: "Compra validada y reconocida correctamente" });
    } else {
      return res.status(400).send(`Compra no válida (estado: ${purchaseData.purchaseState})`);
    }

  } catch (error) {
    console.error("Error validando compra:", error);

    if (error.code === 404) {
      return res.status(404).send("Producto o token no encontrado");
    }
    if (error.code === 401) {
      return res.status(401).send("Permisos insuficientes o credenciales de Google Play inválidas");
    }

    return res.status(500).send("Error interno al validar la compra");
  }
};

// Seleccionar pagos de usuario
const selectPayments = async function (req, res) {
  try {
    const { userId, maxRows } = req.query;

    // Consulta para obtener los pagos del usuario
    let sql = "SELECT * FROM pagos WHERE usuario_id = ? ORDER BY fecha DESC";
    let params = [userId];

    if (maxRows) {
      sql += " LIMIT ?";
      params.push(Number(maxRows));
    }

    const [rows] = await pool.query(sql, params);

    if (isEmptyObject(rows)) {
      return res.status(404).send("Error pagos de usuario no encontrados");
    }

    // Asegurar fecha con formato consistente
    const formattedRows = rows.map(row => ({
      ...row,
      fecha: toLocalString(row.fecha)
    }));

    res.status(200).send(formattedRows);
  } catch (error) {
    console.error("Error al seleccionar pagos de usuario: ", error);
    res.status(500).send("Error del servidor");
  }
}

export {
  selectPayments,
  validatePayment
};