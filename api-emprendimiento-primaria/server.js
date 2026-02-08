import pool from "./src/bd/db.js";
import express from "express";
import compression from "compression";
import { api1 } from "./src/routes/userRoute.js";
import { api2 } from "./src/routes/oauthRoute.js";
import { createServer } from "https";
import { readFileSync } from "fs";

const app = express()

// Configurar puerto dinámico
const PORT = process.env.PORT;

// Middlewares
app.use(compression()); // Compresión de respuestas
app.use(express.json({ limit: "20mb" })); // Parsear JSON con límite de 20MB

// Rutas
app.get("/", (_, res) => {
  res.send("API funcionando 🚀");
});
app.use("/api", api1);
app.use("/api", api2);

// Verificar conexión a la base de datos al iniciar el servidor
try {
  const connection = await pool.getConnection();
  console.log("Conexión a BD exitosa");
  connection.release();
} catch (err) {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("La conexión a la base de datos fue cerrada.");
  }
  if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("La base de datos ha tenido demasiadas conexiones.");
  }
  if (err.code === "ECONNREFUSED") {
    console.error("La conexión a la base de datos fue rechazada.");
  } else {
    console.error("Error al conectar a la base de datos:", err);
  }
}

// Detectar entorno al iniciar el servidor
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // Remoto: solo HTTP, El servidor ya da HTTPS
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en producción en puerto ${PORT}`);
  });
} else {
  // Local: HTTPS con certificados autofirmados
  try {
    const privateKey = readFileSync("./src/certificate/mykey.key");
    const certificate = readFileSync("./src/certificate/mycert.crt");
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = createServer(credentials, app);
    httpsServer.listen(PORT, () => {
      console.log(`Servidor corriendo en desarrollo (HTTPS) en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al leer los certificados: ", error);
    process.exit(1);
  }
}