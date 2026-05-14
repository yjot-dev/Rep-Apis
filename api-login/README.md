# API: Login

Descripción
- API REST para gestión de usuarios y autenticación, envío de correos vía Gmail API (OAuth2), pagos con PayPal y notificaciones con Firebase.

Tecnologías y dependencias
- Node.js (ESM)
- Express
- Express-rate-limit
- MySQL (mysql2)
- Google APIs (googleapis) — envío de correo via Gmail API
- bcrypt — hashing de contraseñas
- dotenv — variables de entorno
- compression (gzip)
- nodemon (desarrollo)
- @paypal/checkout-server-sdk — integración con PayPal para crear y verificar pagos desde la API
- firebase-admin — integración con Firebase Admin SDK para servicios de backend como notificaciones y administración de Firebase

Archivos relevantes
- server.js — arranque del servidor
- src/routes/userRoute.js
- src/routes/oauthRoute.js — rutas OAuth / email
- src/routes/notificationRoute.js
- src/routes/paymentRoute.js
- src/controllers/userController.js
- src/controllers/oauthController.js
- src/controllers/notificationController.js
- src/controllers/paymentController.js
- src/bd/db.js — conexión a MySQL
locales
- .env — variables de entorno (no versionar)

Variables de entorno (ejemplo; no incluir valores sensibles en el repo)
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- NODE_ENV (development | production)
- PORT (opcional por defecto 3000)
- CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN
- PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV, BASE_URL
- FIREBASE_SERVICE_ACCOUNT

Endpoints
- Usuarios
  - POST /api/users/login       — login
  - POST /api/users             — crear usuario
  - PATCH /api/users            — cambiar contraseña
  - PUT /api/users/:id          — actualizar usuario
  - DELETE /api/users/:id       — eliminar usuario
- OAuth / Email
  - GET  /api/oauth/login           — iniciar OAuth (redirige a Google)
  - GET  /api/oauth/oauth2callback  — callback para obtener tokens
  - POST /api/oauth/email           — enviar correo (body: { to, subject, text })
- Pagos
  - POST /api/payments/create-order   — crear orden de pago PayPal
  - GET  /api/payments/paypal-return  — callback de retorno después del pago
  - GET  /api/payments/paypal-cancel  — callback cuando el pago es cancelado
  - POST /api/payments/capture-order  — capturar la orden de pago PayPal
  - GET  /api/payments              — listar pagos registrados
- Notificaciones
  - POST /api/notifications         — enviar notificación Firebase
  - GET  /api/notifications         — obtener notificaciones almacenadas

Instalación
```bash
npm install
```

Configuración
- Crear/editar archivo de variables de entorno en [.env](api-login/.env) con:
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