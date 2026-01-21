# Colección de APIs

Breve descripción
- **Descripción:** Repositorio que agrupa tres APIs independientes basadas en Node.js/Express y MySQL, cada una con su propio servidor HTTPS local y certificados en `src/certificate/`.

APIs incluidas
- **api-accident-reporter:** : [api-accident-reporter](api-accident-reporter/README.md)
- **api-emprendimiento-primaria:** : [api-emprendimiento-primaria](api-emprendimiento-primaria/README.md)
- **api-login:** : [api-login](api-login/README.md)

Estructura general
- **Carpetas:** : Cada API tiene su propia carpeta de proyecto con `server.js`, `package.json`, y `src/`.
- **src/** : Contiene subcarpetas comunes como `bd/` (conexión MySQL), `controllers/`, `routes/` y `certificate/` (certificados TLS locales).

Tecnologías comunes
- **Lenguaje:** : Node.js (ESM)
- **Framework:** : Express
- **Base de datos:** : MySQL (mysql2)
- **Autenticación y seguridad:** : bcrypt, HTTPS nativo (certificados en `src/certificate/`)
- **Correo:** : nodemailer
- **Configuración:** : dotenv
- **Desarrollo:** : nodemon (dev)

Instrucciones generales de instalación y ejecución
- **Paso 1 — Instalar dependencias:** Para cada API, entrar en su carpeta e instalar:

```bash
cd api-<nombre>
npm install
```

- **Paso 2 — Configurar variables:** Crear un archivo `.env` en la raíz de la API con las variables necesarias (ejemplo mínimo):

```text
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
PORT=443
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

- **Paso 3 — Certificados TLS locales:** Colocar los archivos `mykey.key` y `mycert.crt` dentro de `src/certificate/` de cada API si se usa HTTPS local.

- **Paso 4 — Ejecutar en desarrollo:**

```bash
npm run dev
```

- **Paso 5 — Ejecutar en producción:**

```bash
npm start
```

Notas y recomendaciones
- **Puerto por defecto:** : Si no se define `PORT` en `.env`, las APIs suelen usar 443 por defecto.
- **Node:** : Usar una versión de Node compatible con ESM (Node 14+; se recomienda LTS actual).
- **Seguridad:** : No subir `.env` ni certificados al control de versiones.