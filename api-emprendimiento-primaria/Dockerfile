# Imagen base oficial de Node.js
FROM node:18-alpine

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app/api-emprendimiento-primaria

# Copiar package.json y package-lock.json primero
COPY api-emprendimiento-primaria/package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY api-emprendimiento-primaria .

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]