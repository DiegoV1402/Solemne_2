# Usa una imagen oficial de Node.js ligera
FROM node:22-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# 1. Copiamos absolutamente TODO tu proyecto al contenedor primero
COPY . .


# Esto evita que los accesos directos de tu PC rompan la instalación en Linux
RUN rm -rf node_modules

# 3. Instalamos las dependencias 100% limpias desde cero
RUN pnpm install

# Expone el puerto donde corre Express
EXPOSE 3000

# Comando para encender el servidor backend
CMD ["node", "index.js"]