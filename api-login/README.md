# API: Login

Descripción
- API REST para gestión de usuarios y autenticación, además de envío de correos vía Gmail API (OAuth2).
- Rutas principales: usuarios (/api/users) y OAuth/email (/api/oauth).

Tecnologías y dependencias
- Node.js (ESM)
- Express
- Express-rate-limit
- MySQL (mysql2)
- Google APIs (googleapis) — envío de correo via Gmail API
- bcrypt — hashing de contraseñas
- dotenv — variables de entorno
- compression (gzip)
- HTTPS local con certificados autofirmados
- nodemon (desarrollo)

Archivos relevantes
- server.js — arranque del servidor (HTTPS en desarrollo, HTTP en producción)
- src/routes/userRoute.js — rutas de usuarios
- src/routes/oauthRoute.js — rutas OAuth / email
- src/controllers/userController.js
- src/controllers/oauthController.js
- src/bd/db.js — conexión a MySQL
- src/certificate/mykey.key, src/certificate/mycert.crt — certificados TLS locales
- .env — variables de entorno (no versionar)

Variables de entorno (ejemplo; no incluir valores sensibles en el repo)
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- NODE_ENV (development | production)
- PORT (opcional por defecto 3000)
- CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN

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

Instalación
```bash
npm install
```

Configuración
- Crear/editar archivo de variables de entorno en [.env](api-login/.env) con:
  - MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- Colocar certificados TLS en:
  - src/certificate/mykey.key
  - src/certificate/mycert.crt
- El servidor lee estos archivos en [server.js](api-login/server.js).

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