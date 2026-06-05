import expressRateLimit from "express-rate-limit";
import express from "express";
import compression from "compression";
import { api1 } from "./src/routes/clasificadorRoute.js";

const isProduction = process.env.NODE_ENV === "production"; // Detectar entorno al iniciar el servidor

// Cargar variables de entorno solo en desarrollo
if (!isProduction) {
  const dotenv = await import("dotenv");
  dotenv.config();
}

const dailyLimiter = expressRateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 80, // máximo 80 requests por IP al día
  message: "Has alcanzado el límite diario de solicitudes."
});

const PORT = process.env.PORT; // Configurar puerto dinámico

const app = express()

// Confía en el proxy inverso (Nginx) solo en desarrollo
if (!isProduction) {
  app.set("trust proxy", 1);
}

// Middlewares
app.use(compression()); // Compresión de respuestas
app.use(express.json({ limit: "20mb" })); // Parsear JSON con límite de 20MB

// Rutas
app.get("/", (_, res) => {
  res.send("API funcionando 🚀");
});
app.use("/api", dailyLimiter, api1);

// Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
  if (isProduction) {
    // Remoto: solo HTTP, el servidor ya da HTTPS
    console.log(`Servidor corriendo en producción en puerto ${PORT}`);
  } else {
    // Local: solo HTTP, el servidor no requiere HTTPS (no es buena practica)
    console.log(`Servidor corriendo en desarrollo en puerto ${PORT}`);
  }
});