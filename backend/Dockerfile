# Usa una imagen oficial de Node.js
FROM node:18-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia los archivos de dependencias primero
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias
RUN pnpm install

# Copia el resto del código de tu backend
COPY . .

# Expone el puerto (asumo el 3000, si tu index.js usa otro, cámbialo)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]