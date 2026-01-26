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
- MySQL (mysql2)
- dotenv
- nodemon (dev)
- HTTPS local con certificados autofirmados (en desarrollo cada API lee src/certificate/mykey.key y mycert.crt)
- googleapis (solo en los proyectos que usan Gmail OAuth)
- bcrypt (hash de contraseñas en proyectos que manejan usuarios)

Dependencias (por proyecto)
- api-login: express, mysql2, dotenv, googleapis, bcrypt
- api-emprendimiento-primaria: express, mysql2, dotenv, googleapis, bcrypt
- api-accident-reporter: express, mysql2, dotenv

Variables de entorno (ejemplos)
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- NODE_ENV (development | production)
- PORT (opcional)
- (Google OAuth) CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN
> Mantener .env y secretos fuera del repositorio (.gitignore)

Instalación y ejecución (por cada API)
1. Entrar al directorio de la API:
   - cd api-login
   - cd api-emprendimiento-primaria
   - cd api-accident-reporter
2. Instalar dependencias:
```bash
npm install
```
3. Configurar .env en `src/bd/.env` (o en la raíz del proyecto) y colocar certificados en `src/certificate/` si usa HTTPS local.
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