import pool from "./src/bd/db.js";
import expressRateLimit from "express-rate-limit";
import express from "express";
import compression from "compression";
import { api1 } from "./src/routes/geocodingRoute.js";
import { api2 } from "./src/routes/reportRoute.js";

const isProduction = process.env.NODE_ENV === "production"; // Detectar entorno al iniciar el servidor

const dailyLimiter = expressRateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 80, // máximo 80 requests por IP al día
  message: "Has alcanzado el límite diario de solicitudes."
});

const PORT = process.env.PORT; // Configurar puerto dinámico

const app = express()

// Middlewares
app.use(compression()); // Compresión de respuestas
app.use(express.json({ limit: "20mb" })); // Parsear JSON con límite de 20MB

// Rutas
app.get("/", (_, res) => {
  res.send("API funcionando 🚀");
});
app.use("/api", dailyLimiter, api1);
app.use("/api", dailyLimiter, api2);

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

app.listen(PORT, () => {
  if (isProduction) {
    // Remoto: solo HTTP, el servidor ya da HTTPS
    console.log(`Servidor corriendo en producción en puerto ${PORT}`);
  } else {
    // Local: solo HTTP, el servidor no requiere HTTPS (no es buena practica)
    console.log(`Servidor corriendo en desarrollo en puerto ${PORT}`);
  }
});