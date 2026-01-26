# API: Emprendimiento Primaria

Descripción
- API REST para gestión de usuarios (registro, login, actualización, eliminación, cambio de clave) y envío de correos vía Gmail API (OAuth2).
- Rutas principales: usuarios (/api/users) y OAuth/email (/api/oauth).
- En desarrollo corre por HTTPS local con certificados autofirmados; en producción usa HTTP (según NODE_ENV).

Tecnologías y dependencias
- Node.js (ESM)
- Express
- MySQL (mysql2)
- googleapis (Gmail API / OAuth2)
- bcrypt (hash de contraseñas)
- dotenv (variables de entorno)
- nodemon (dev)
- Dependencias (package.json): bcrypt, dotenv, express, googleapis, mysql2. Dev: nodemon.

Estructura relevante
- server.js — arranque del servidor (HTTPS en dev, HTTP en prod)
- src/routes/userRoute.js — /api/users
- src/routes/oauthRoute.js — /api/oauth
- src/controllers/userController.js
- src/controllers/oauthController.js
- src/bd/db.js — conexión a MySQL
- src/certificate/ — mykey.key, mycert.crt (certificados locales)
- src/bd/.env — variables de entorno (no versionar)

Variables de entorno (ejemplo; no incluir valores sensibles en el repo)
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- NODE_ENV (development | production)
- PORT (opcional; por defecto 3000)
- CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN

Endpoints principales
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
1. Crear archivo .env con las variables listadas arriba (ej: src/bd/.env).
2. Colocar certificados TLS en:
   - src/certificate/mykey.key
   - src/certificate/mycert.crt

Ejecución
- Desarrollo (HTTPS local):
```bash
npm run dev
```
- Producción (HTTP):
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