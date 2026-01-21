# API: Emprendimiento Primaria

Descripción
- API REST para gestión de usuarios y funcionalidades relacionadas (rutas principales en `src/routes/userRoute.js`).
- Usa HTTPS con certificados locales.

Tecnologías principales
- Node.js (ESM)
- Express
- MySQL (mysql2)
- bcrypt (hash de contraseñas)
- nodemailer (envío de correos)
- dotenv
- HTTPS nativo (lectura de certificados)

Dependencias (ver `package.json`)
- express
- mysql2
- bcrypt
- nodemailer
- dotenv
- https (API nativa)
- nodemon (dev)

Estructura relevante
- `server.js` — arranque del servidor HTTPS (lee `src/certificate/mykey.key` y `src/certificate/mycert.crt`).
- `src/routes/userRoute.js` — rutas públicas de la API.
- `src/controllers/` — controladores (lógica de negocio).
- `src/bd/db.js` — conexión a MySQL (usa variables de entorno).
- `src/certificate/` — certificados TLS.
- `.env` — configuración de BD y credenciales (no incluida en el repo).

Variables de entorno (ejemplo)
- MYSQL_HOST
- MYSQL_PORT
- MYSQL_USER
- MYSQL_PASSWORD
- MYSQL_DATABASE
- PORT (opcional, por defecto 443)
- SMTP_HOST (si usa nodemailer)
- SMTP_PORT
- SMTP_USER
- SMTP_PASS

Instalación
```sh
npm install
```

Configuración
1. Crear archivo `.env` en `src/bd/` o en la raíz con las variables de entorno necesarias.
2. Colocar certificados TLS en:
   - `src/certificate/mykey.key`
   - `src/certificate/mycert.crt`

Ejecución
- Desarrollo (nodemon):
```sh
npm run dev
```
- Producción:
```sh
npm start
```
El servidor escucha en el puerto `PORT` o 443 por defecto.

Notas
- Asegurar versión de Node que soporte ESM y top-level await si se usa en la conexión a BD.
- Revisar permisos y rutas de certificados y archivo `.env`.