# API: Accident Reporter

Descripción
- API para gestionar reportes de accidentes (listar, crear, actualizar, eliminar).

Tecnologías
- Node.js (ESM)
- Express
- MySQL (mysql2)
- HTTPS (certificados locales)
- dotenv

Archivos relevantes
- [api-accident-reporter/server.js](api-accident-reporter/server.js)
- [api-accident-reporter/package.json](api-accident-reporter/package.json)
- [api-accident-reporter/src/routes/reportRoute.js](api-accident-reporter/src/routes/reportRoute.js)
- [`seleccionar_reportes`](api-accident-reporter/src/controllers/reportController.js) — [api-accident-reporter/src/controllers/reportController.js](api-accident-reporter/src/controllers/reportController.js)
- [`insertar_reporte`](api-accident-reporter/src/controllers/reportController.js) — [api-accident-reporter/src/controllers/reportController.js](api-accident-reporter/src/controllers/reportController.js)
- [`actualizar_reporte`](api-accident-reporter/src/controllers/reportController.js) — [api-accident-reporter/src/controllers/reportController.js](api-accident-reporter/src/controllers/reportController.js)
- [`eliminar_reporte`](api-accident-reporter/src/controllers/reportController.js) — [api-accident-reporter/src/controllers/reportController.js](api-accident-reporter/src/controllers/reportController.js)
- [api-accident-reporter/src/bd/db.js](api-accident-reporter/src/bd/db.js)
- [api-accident-reporter/src/bd/.env](api-accident-reporter/src/bd/.env) (ejemplo de variables de BD)
- Certificados: [api-accident-reporter/src/certificate/mykey.key](api-accident-reporter/src/certificate/mykey.key) y [api-accident-reporter/src/certificate/mycert.crt](api-accident-reporter/src/certificate/mycert.crt)

Endpoints
- GET /api/reports → [`seleccionar_reportes`](api-accident-reporter/src/controllers/reportController.js)
- POST /api/reports → [`insertar_reporte`](api-accident-reporter/src/controllers/reportController.js)
- PUT /api/reports/:id → [`actualizar_reporte`](api-accident-reporter/src/controllers/reportController.js)
- DELETE /api/reports/:id → [`eliminar_reporte`](api-accident-reporter/src/controllers/reportController.js)

Dependencias (ver [package.json](api-accident-reporter/package.json))
- express
- mysql2
- dotenv
- https (uso de API nativa)
- nodemon (dev)

Instalación
```sh
npm install
```

Configuración
- Crear/editar archivo de variables de entorno en [src/bd/.env](api-accident-reporter/src/bd/.env) con:
  - MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- Colocar certificados TLS en:
  - src/certificate/mykey.key
  - src/certificate/mycert.crt
  El servidor lee estos archivos en [server.js](api-accident-reporter/server.js).

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