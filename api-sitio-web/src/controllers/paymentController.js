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

// Define el cliente de PayPal
const client = new paypal.core.PayPalHttpClient(environment());

// Crear orden de pago
const createOrder = async function (req, res) {
  try {
    const { plan, userId, moneyCode } = req.body;

    let amountOfMoney;
    switch (plan) {
      case "test": amountOfMoney = "1.00"; break;
      case "lv1-support": amountOfMoney = "5.00"; break;
      case "lv2-support": amountOfMoney = "10.00"; break;
      default: return res.status(400).send("Plan inválido");
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: moneyCode,
            value: amountOfMoney,
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
    if (rows.length === 0) {
      return res.status(404).send("Usuario no encontrado para esta orden");
    }

    res.status(200).send("Orden capturada correctamente");
  } catch (error) {
    console.error("Error capturando orden PayPal:", error);
    res.status(500).send("Error del servidor");
  }
};

export {
  createOrder,
  paypalReturn,
  paypalCancel,
  captureOrder
};