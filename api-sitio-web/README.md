# API: Sitio Web

Descripción
- API REST para gestión de pagos con PayPal desde la web.

Tecnologías y dependencias
- Node.js (ESM)
- Express
- Express-rate-limit
- MySQL (mysql2)
- dotenv — variables de entorno
- compression (gzip)
- nodemon (desarrollo)
- @paypal/checkout-server-sdk — integración con PayPal para crear y verificar pagos desde la API

Archivos relevantes
- server.js — arranque del servidor
- src/routes/paymentRoute.js
- src/controllers/paymentController.js
- src/bd/db.js — conexión a MySQL
locales
- .env — variables de entorno (no versionar)

Variables de entorno (ejemplo; no incluir valores sensibles en el repo)
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- NODE_ENV (development | production)
- PORT (opcional por defecto 3000)
- PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV

Endpoints
- Pagos
  - POST /api/payments/create-order   — crear orden de pago PayPal
  - GET  /api/payments/paypal-return  — callback de retorno después del pago
  - GET  /api/payments/paypal-cancel  — callback cuando el pago es cancelado
  - POST /api/payments/capture-order  — capturar la orden de pago PayPal
  - GET  /api/payments                — listar pagos registrados

Instalación
```bash
npm install
```

Configuración
- Crear/editar archivo de variables de entorno en [.env](api-sitio-web/.env) con:
  - MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE

Ejecución
- Desarrollo:
```bash
npm run dev
```
- Producción:
```bash
npm start
```
El servidor usa PORT o 3000 por defecto; en producción respeta process.env.PORT.

Comprobaciones útiles
- Verificar que .env no esté versionado (.gitignore).
- Si un archivo ya fue commiteado, dejar de rastrearlo:
```bash
git rm -r --cached ruta/al/archivo
git commit -m "Stop tracking ignored files"
```

Notas
- No subir CLIENT_SECRET ni REFRESH_TOKEN públicamente.
- Asegurar versión de Node compatible con ESM.