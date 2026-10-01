# API: Emprendimiento Primaria

Descripción
- API REST para gestión de usuarios (registro, login, actualización, eliminación, cambio de clave) y envío de correos vía Gmail API (OAuth2).
- Rutas principales: usuarios (/api/users) y OAuth/email (/api/oauth).

Tecnologías y dependencias
- Node.js (ESM)
- Express
- Express-rate-limit
- MySQL (mysql2)
- googleapis (Gmail API / OAuth2)
- bcrypt (hash de contraseñas)
- dotenv (variables de entorno)
- compression (gzip)
- nodemon (dev)

Archivos relevantes
- server.js — arranque del servidor (HTTPS en dev, HTTP en prod)
- src/routes/userRoute.js — /api/users
- src/routes/oauthRoute.js — /api/oauth
- src/controllers/userController.js
- src/controllers/oauthController.js
- src/bd/db.js — conexión a MySQL
- .env — variables de entorno (no versionar)

Variables de entorno (ejemplo; no incluir valores sensibles en el repo)
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- NODE_ENV (development | production)
- PORT (opcional por defecto 3000)
- CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN

Endpoints
- Usuarios
  - POST /api/users/login       — login (body: { nombre|correo, clave })
  - POST /api/users             — crear usuario
  - PUT  /api/users/:id         — actualizar usuario
  - PATCH /api/users            — cambiar contraseña
  - DELETE /api/users/:id       — eliminar usuario
- OAuth / Email
  - GET  /api/oauth/login           — iniciar OAuth (redirige a Google)
  - GET  /api/oauth/oauth2callback  — callback para obtener tokens
  - POST /api/oauth/email           — enviar correo (body: { to, subject, text })
  - POST /api/oauth/feedback        — enviar feedback a la cuenta

Instalación
```bash
npm install
```

Configuración
- Crear/editar archivo de variables de entorno en [.env](api-emprendimiento-primaria/.env) con:
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