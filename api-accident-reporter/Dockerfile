# Imagen base oficial de Node.js
FROM node:18-alpine

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app/api-accident-reporter

# Copiar package.json y package-lock.json primero
COPY api-accident-reporter/package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY api-accident-reporter .

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]