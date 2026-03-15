# API: Accident Reporter

Descripción
- API para gestionar reportes de accidentes (listar, crear, actualizar, eliminar).

Tecnologías y dependencias
- Node.js (ESM)
- Express
- Express-rate-limit
- MySQL (mysql2)
- HTTPS (certificados locales)
- dotenv
- compression (gzip)
- nodemon (dev)

Archivos relevantes
- server.js
- package.json
- src/routes/reportRoute.js
- src/routes/geocodingRoute.js
- src/controllers/reportController.js
- src/controllers/geocodingController.js
- src/bd/db.js
- src/certificate/mykey.key
- src/certificate/mycert.crt
- .env — variables de entorno (no versionar)

Variables de entorno (ejemplo; no incluir valores sensibles en el repo)
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- NODE_ENV (development | production)
- PORT (opcional por defecto 3000)
- GEOCODING_API_KEY

Endpoints
- GET /api/reports — seleccionar_reportes
- POST /api/reports — insertar_reporte
- PUT /api/reports/:id — actualizar_reporte
- DELETE /api/reports/:id — eliminar_reporte

Instalación
```sh
npm install
```

Configuración
- Crear/editar archivo de variables de entorno en [.env](api-accident-reporter/.env) con:
  - MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- Colocar certificados TLS en:
  - src/certificate/mykey.key
  - src/certificate/mycert.crt
- El servidor lee estos archivos en [server.js](api-accident-reporter/server.js).

Ejecución
- Modo desarrollo (nodemon):
```sh
npm run dev
```
- Producción:
```sh
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
- Asegurar versión de Node compatible con ESM.