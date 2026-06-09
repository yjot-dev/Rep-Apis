# Imagen base oficial de Node.js
FROM node:18-bullseye

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias del sistema necesarias para tfjs-node
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libvips \
    && rm -rf /var/lib/apt/lists/*

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 8080

# Comando de inicio
CMD ["npm", "start"]