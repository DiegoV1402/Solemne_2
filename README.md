# 👹 Demon Threshold

**Demon Threshold** es un juego 2D estilo roguelike de supervivencia donde el jugador debe sobrevivir a oleadas de enemigos en una dungeon y lograr avanzar de sala para así matar al jefe final. Elige entre **Guerrero** (combate cuerpo a cuerpo) o **Mago** (ataque a distancia), muévete con **WASD**, ataca hacia el cursor manteniendo presionado el botón izquierdo del mouse o la tecla espacio, y derrota enemigos para ganar experiencia. Al subir de nivel, elige una **Bendición Corrupta** que potenciará tu personaje de forma permanente durante la partida. La dificultad aumenta progresivamente conforme avanzas de sala: más enemigos, más rápidos y más fuertes.

El proyecto cuenta con un sistema de cuentas de usuario, autenticación con JWT y una tabla de clasificación (leaderboard) persistente en MongoDB.

Desarrollado con **Vue 3**, **Phaser 3**, **Pinia** y **Vite** en el frontend, y **Node.js**, **Express** y **MongoDB** en el backend.

---

## 📂 Estructura del proyecto

```text
├── frontend/     # Vue 3 + Phaser 3 + Pinia + Vite
├── backend/      # Node.js + Express + MongoDB (Mongoose)
└── docker-compose.yml
```

---

## 📋 Requisitos previos

### Ejecución local
- [Node.js](https://nodejs.org/) v22 o superior
- [pnpm](https://pnpm.io/) v8
- Una instancia de [MongoDB](https://www.mongodb.com/) accesible (local o remota) para el backend

```bash
# Instalar pnpm v8 si no lo tienes
npm install -g pnpm@8
```

### Ejecución con Docker
- [Docker](https://www.docker.com/) v20 o superior
- [Docker Compose](https://docs.docker.com/compose/) (incluido en Docker Desktop / Docker Engine reciente)

---

## 🚀 Ejecutar la aplicación localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoV1402/Solemne_2
cd Solemne_2
```

### 2. Backend

```bash
cd backend
pnpm install
```

Crea un archivo `.env` dentro de `backend/` con las siguientes variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/demon_threshold
JWT_SECRET=tu_secreto_super_seguro
```

Levanta el servidor en modo desarrollo (usa `nodemon`, se reinicia automáticamente ante cambios):

```bash
pnpm dev
```

El backend quedará disponible en: **http://localhost:3000**

> Asegúrate de tener una instancia de MongoDB corriendo y accesible en la URI configurada antes de iniciar el backend. Puedes levantar una rápidamente con:
> ```bash
> docker run -d -p 27017:27017 --name mongodb_local mongo:latest
> ```

### 3. Frontend

En otra terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

La aplicación estará disponible en: **http://localhost:5173**

> El frontend consume el backend en `http://localhost:3000` (configurado en los stores de autenticación y partidas). Asegúrate de que el backend esté corriendo antes de iniciar sesión o guardar partidas.

### 4. (Opcional) Compilar el frontend para producción

```bash
cd frontend
pnpm build
```

Los archivos compilados se generarán en `frontend/dist/`.

```bash
pnpm preview
```

---

## 🐳 Ejecutar la aplicación con Docker Compose

La forma más simple de levantar los tres servicios (MongoDB + Backend + Frontend) juntos, sin instalar Node.js ni pnpm en tu máquina.

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoV1402/Solemne_2
cd Solemne_2
```

### 2. (Opcional) Configurar variables de entorno del backend

El `docker-compose.yml` ya define `MONGO_URI` apuntando al contenedor de MongoDB interno. Si necesitas variables adicionales (como `JWT_SECRET`), puedes agregarlas en la sección `environment` del servicio `backend` dentro de `docker-compose.yml`, o crear un archivo `backend/.env` y referenciarlo con `env_file`.

### 3. Levantar todos los servicios

```bash
docker compose up --build
```

Esto construirá las imágenes de `frontend` y `backend` a partir de sus respectivos `Dockerfile` y levantará:

| Servicio   | Puerto expuesto | URL                       |
|------------|------------------|----------------------------|
| `frontend` | `80`             | http://localhost           |
| `backend`  | `3000`           | http://localhost:3000      |
| `mongodb`  | `27017`          | mongodb://localhost:27017  |

### 4. Detener los servicios

```bash
docker compose down
```

Para eliminar también el volumen de datos de MongoDB:

```bash
docker compose down -v
```

---

## 🔗 Imágenes en Docker Hub

Las imágenes de este proyecto se publican automáticamente en Docker Hub mediante el pipeline de CI/CD (`.github/workflows/main.yml`) en cada push a `main`.

| Servicio | Imagen | Repositorio en Docker Hub |
|---|---|---|
| Frontend | `diegov1402/demon-threshold:latest` | ➡️ [hub.docker.com/r/diegov1402/demon-threshold](https://hub.docker.com/r/diegov1402/demon-threshold) |
| Backend  | `diegov1402/demon-threshold-backend:latest` | ➡️ [hub.docker.com/r/diegov1402/demon-threshold-backend](https://hub.docker.com/r/diegov1402/demon-threshold-backend) |

### Ejecutar solo el frontend (rápido, sin clonar el repo)

```bash
docker run -p 8080:80 diegov1402/demon-threshold:latest
```

La aplicación estará disponible en: **http://localhost:8080**

> Nota: para tener funcionalidad completa (login, registro, leaderboard) necesitas también el backend y una base de datos MongoDB corriendo — para eso se recomienda usar Docker Compose (ver sección anterior).

Para detener el contenedor:

```bash
docker stop demon-threshold
docker rm demon-threshold
```

---

## 🎮 Cómo jugar

| Acción | Control |
|---|---|
| Moverse | `W` `A` `S` `D` |
| Atacar | Mantener presionado el botón izquierdo del mouse o apretar la tecla espacio |
| Apuntar | Mover el cursor hacia el objetivo |
| Pausa | `ESC` |

1. Inicia sesión o regístrate, y presiona **Jugar**.
2. Elige tu clase: **Guerrero** (más vida, combate cuerpo a cuerpo) o **Mago** (menos vida, ataque a distancia más fuerte).
3. Dirígete hacia la primera sala y ataca para eliminar a los enemigos.
4. Derrota enemigos para llenar la barra de experiencia.
5. Al subir de nivel (cada 4 niveles), elige una de las **Bendiciones Corruptas** disponibles.
6. Avanza entre las salas de la mazmorra hasta enfrentar al jefe final.
7. Si tu vida llega a cero, se muestran tus resultados, se guardan en el leaderboard (si iniciaste sesión) y puedes **Reintentar**.

---

## 🛠️ Tecnologías utilizadas

### Frontend
| Tecnología | Uso |
|---|---|
| [Vue 3](https://vuejs.org/) | Framework principal de la UI |
| [Phaser 3](https://phaser.io/) | Motor del juego (renderizado, física, escenas) |
| [Pinia](https://pinia.vuejs.org/) | Gestión del estado global (vida, nivel, estadísticas, autenticación) |
| [Vite](https://vitejs.dev/) | Empaquetador (bundler) y servidor de desarrollo |

### Backend
| Tecnología | Uso |
|---|---|
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | API REST |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Persistencia de usuarios y puntajes |
| [JWT](https://jwt.io/) + [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Autenticación y manejo de contraseñas |

### DevOps
| Herramienta | Uso |
|---|---|
| [Docker](https://www.docker.com/) / [Docker Compose](https://docs.docker.com/compose/) | Contenerización y orquestación local |
| [GitHub Actions](https://github.com/features/actions) | CI/CD: lint, tests y build/push automático de imágenes |

---

## 👥 Créditos

- Manuel Figueroa
- Diego Vargas