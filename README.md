# Monorepo: Apis

Descripción
- Contiene 5 APIs independientes:
  - api-gupn — gestión de usuario, pagos, notificaciones y envío de correos via Gmail API.
  - api-emp — gestión de usuario y envío de correos/feedback via Gmail API.
  - api-ari — gestión de reportes (listar, crear, actualizar, eliminar).
  - api-cp — obtención de información detallada sobre especies de peces, caracoles, gambas y tortugas.
  - api-cb — obtención de información detallada sobre variedades de banano.

Estructura
- api-gupn/
- api-emp/
- api-ari/
- api-cp/
- api-cb/

Tecnologías comunes
- Node.js (ESM)
- Express
- Express-rate-limit
- Dotenv
- Compression (gzip)
- Nodemon (dev)

Dependencias (por proyecto)
- api-gupn: express, express-rate-limit, mysql2, dotenv, compression, googleapis, bcrypt
- api-emp: express, express-rate-limit, mysql2, dotenv, compression, googleapis, bcrypt
- api-ari: express, express-rate-limit, mysql2, dotenv, compression
- api-cp: express, express-rate-limit, mysql2, dotenv, compression, @google-cloud/translate
- api-cb: express, express-rate-limit, mysql2, dotenv, compression, @google-cloud/translate

Instalación y ejecución (por cada API)
1. Entrar al directorio de la API:
   - cd api-gupn
   - cd api-emp
   - cd api-ari
   - cd api-cp
   - cd api-cb
2. Instalar dependencias:
```bash
npm install
```
3. Configurar .env en la raíz del proyecto.
4. Ejecutar:
- Desarrollo (con recarga automática):
```bash
npm run dev
```
- Producción:
```bash
npm start
```

Por defecto usan PORT=3000 si no se define.

Notas rápidas
- Si un archivo ya fue versionado antes de agregarse a .gitignore, dejar de rastrearlo:
```bash
git rm -r --cached ruta/al/archivo
git commit -m "Actualizacion de .gitignore"
```

- Verifica reglas de .gitignore con:
```bash
git check-ignore -v ruta/al/archivo
git ls-files --others --exclude-standard
```