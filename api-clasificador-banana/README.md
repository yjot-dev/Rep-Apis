# API: Clasificador de Bananas

Descripción
- API para obtener información detallada sobre especies de banano.

Tecnologías y dependencias
- Node.js (ESM)
- @google-cloud/translate
- compression (gzip)
- Express
- Express-rate-limit
- mysql2
- dotenv
- nodemon (dev)

Archivos relevantes
- server.js
- package.json
- src/routes/especiesRoute.js
- src/controllers/especiesController.js
- .env — variables de entorno (no versionar)

Variables de entorno (ejemplo; no incluir valores sensibles en el repo)
- PORT (opcional, por defecto 3000)
- NODE_ENV (development | production)

Endpoints
- GET /species — seleccionar_especies

Instalación
```sh
npm install
```

Configuración
- Crear/editar archivo de variables de entorno en [.env](api-clasificador-banana/.env) con:
  - PORT, NODE_ENV

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