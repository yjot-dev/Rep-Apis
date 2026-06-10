import pool from "../bd/db.js";
import paypal from "@paypal/checkout-server-sdk";

// Configuración del entorno de PayPal
function environment() {
  if (process.env.PAYPAL_ENV === "sandbox") {
    return new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
  } else {
    return new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
  }
}

// Verifica si el objeto esta vacio
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

const client = new paypal.core.PayPalHttpClient(environment());

// Crear orden de pago
const createOrder = async function (req, res) {
  try {
    const { plan, userId } = req.body;

    let amount;
    switch (plan) {
      case "basic": amount = "5.00"; break;
      case "premium": amount = "10.00"; break;
      case "enterprise": amount = "20.00"; break;
      default: return res.status(400).send("Plan inválido");
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
      application_context: {
        return_url: `com.yjotdev.login://paypal/return`,
        cancel_url: `com.yjotdev.login://paypal/cancel`
      }
    });

    // Ejecutar la solicitud para crear la orden de pago de Paypal
    const order = await client.execute(request);

    // Extraer el approveUrl de los links que devuelve PayPal
    const approveUrl = order.result.links.find(link => link.rel === "approve").href;

    // Guardar orderId y userId en la tabla 'ordenes_temp'
    const orden_temp = { orderId: order.result.id, userId: userId }
    await pool.query("INSERT INTO ordenes_temp SET ?", orden_temp);

    res.status(200).json({ approveUrl: approveUrl });
  } catch (error) {
    console.error("Error creando orden PayPal:", error);
    res.status(500).send("Error del servidor");
  }
};

// Controlador para aprobación de pago
const paypalReturn = async function (req, res) {
  const token = req.query.token;
  res.send(`
    <script>
      window.location.href = "com.yjotdev.login://paypal/return?token=${token}";
    </script>
  `);
}

// Controlador para cancelación de pago
const paypalCancel = async function (_, res) {
  res.send(`
    <script>
      window.location.href = "com.yjotdev.login://paypal/cancel";
    </script>
  `);
}

// Capturar pago
const captureOrder = async function (req, res) {
  try {
    const { orderId } = req.body;

    // Capturar la orden en PayPal
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const capture = await client.execute(request);

    // Extraer datos relevantes
    const result = capture.result.purchase_units[0].payments.captures[0];
    const amount = result.amount.value;
    const money = result.amount.currency_code
    const status = result.status;
    const date = new Date(result.update_time);

    // Recuperar el userId asociado al orderId
    const [rows] = await pool.query(
      "SELECT userId FROM ordenes_temp WHERE orderId = ?",
      [orderId]
    );
    if (isEmptyObject(rows)) {
      return res.status(404).send("Usuario no encontrado para esta orden");
    }
    const userId = rows[0].userId;

    // Guardar pago en la tabla 'pagos'
    const pago = { monto: amount, moneda: money, estado: status, fecha: date, usuario_id: userId };
    await pool.query("INSERT INTO pagos SET ?", pago);

    res.status(200).send("Orden capturada correctamente");
  } catch (error) {
    console.error("Error capturando orden PayPal:", error);
    res.status(500).send("Error del servidor");
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

    res.status(200).send(rows);
  } catch (error) {
    console.error("Error al seleccionar pagos de usuario: ", error);
    res.status(500).send("Error del servidor");
  }
}

export {
  createOrder,
  paypalReturn,
  paypalCancel,
  captureOrder,
  selectPayments
};