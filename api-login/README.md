# API: Login

Descripción
- API REST para gestión de usuarios/autenticación (rutas en `src/routes/userRoute.js`).
- Servicio HTTPS local que carga certificados desde `src/certificate/`.

Tecnologías
- Node.js (ESM)
- Express
- MySQL (mysql2)
- bcrypt (hash de contraseñas)
- nodemailer (envío de correos)
- dotenv
- HTTPS nativo de Node

Dependencias (ver package.json)
- bcrypt
- dotenv
- express
- fs (API nativa)
- https (API nativa)
- mysql2
- nodemailer
- nodemon (dev)

Archivos relevantes
- `server.js` — arranque del servidor HTTPS
- `src/routes/userRoute.js` — rutas de usuario
- `src/controllers/` — controladores
- `src/bd/db.js` — conexión a MySQL
- `src/certificate/mykey.key` y `src/certificate/mycert.crt` — certificados TLS
- `.env` — variables de entorno (no incluido)

Variables de entorno recomendadas
- MYSQL_HOST
- MYSQL_PORT
- MYSQL_USER
- MYSQL_PASSWORD
- MYSQL_DATABASE
- PORT (opcional, por defecto 443)
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS

Instalación
```sh
npm install
```

Configuración
1. Crear un archivo `.env` con las variables de entorno necesarias.
2. Colocar certificados TLS en `src/certificate/mykey.key` y `src/certificate/mycert.crt`.

Ejecución
- Desarrollo (nodemon):
```sh
npm run dev
```
- Producción:
```sh
npm start
```

Notas
- Asegurar versión de Node compatible con ESM.
- El servidor usa el puerto definido en `PORT` o 443 por defecto.