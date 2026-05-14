# Monorepo: Apis

Descripción
- Contiene 3 APIs independientes:
  - api-login — gestión de usuario, pagos, notificaciones y envío de correos via Gmail API.
  - api-emprendimiento-primaria — gestión de usuario y envío de correos/feedback via Gmail API.
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