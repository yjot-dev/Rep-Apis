# Monorepo: Apis

Descripción
- Contiene 3 APIs independientes:
  - api-login — autenticación, usuarios y envío de correos via Gmail API (OAuth2).
  - api-emprendimiento-primaria — gestión de usuarios y envío de correos/feedback via Gmail API (OAuth2).
  - api-accident-reporter — gestión de reportes (listar, crear, actualizar, eliminar).

Estructura
- api-login/
- api-emprendimiento-primaria/
- api-accident-reporter/

Tecnologías comunes
- Node.js (ESM)
- Express
- Express-rate-limit
- MySQL (mysql2)
- Dotenv
- Compression (gzip)
- Nodemon (dev)
- HTTPS local con certificados autofirmados (en desarrollo cada API lee src/certificate/mykey.key y mycert.crt)

Dependencias (por proyecto)
- api-login: express, express-rate-limit, mysql2, dotenv, compression, googleapis, bcrypt
- api-emprendimiento-primaria: express, express-rate-limit, mysql2, dotenv, compression, googleapis, bcrypt
- api-accident-reporter: express, express-rate-limit, mysql2, dotenv, compression

Instalación y ejecución (por cada API)
1. Entrar al directorio de la API:
   - cd api-login
   - cd api-emprendimiento-primaria
   - cd api-accident-reporter
2. Instalar dependencias:
```bash
npm install
```
3. Configurar .env en la raíz del proyecto y colocar certificados en `src/certificate/` si usa HTTPS local.
4. Ejecutar:
- Desarrollo (con recarga automática, HTTPS local si hay certificados):
```bash
npm run dev
```
- Producción:
```bash
npm start
```
Por defecto usan PORT=3000 si no se define.

Notas rápidas
- En desarrollo las apps intentan arrancar HTTPS leyendo `src/certificate/mykey.key` y `src/certificate/mycert.crt`; si no quieres HTTPS, exporta NODE_ENV=production (o ajusta server.js).
- Si un archivo ya fue versionado antes de agregarse a .gitignore, dejar de rastrearlo:
```bash
git rm -r --cached ruta/al/archivo
git commit -m "Stop tracking ignored files"
```
- Verifica reglas de .gitignore con:
```bash
git check-ignore -v ruta/al/archivo
git ls-files --others --exclude-standard
```