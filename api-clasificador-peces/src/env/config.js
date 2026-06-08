if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

export const port = process.env.PORT || 3000; // Configurar puerto dinámico
export const isProduction = process.env.NODE_ENV === "production"; // Detectar entorno al iniciar el servidor