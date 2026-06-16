# 👹 Demon Threshold

**Demon Threshold** es un juego 2D estilo roguelike de supervivencia donde el jugador debe sobrevivir a oleadas de enemigos en una dungeon y lograr avanzar de sala para así matar al jefe final. Muévete con **WASD**, dispara hacia el cursor manteniendo presionado el botón izquierdo del mouse o la tecla espacio y derrota enemigos para ganar experiencia. Al subir de nivel, elige una **Bendición Corrupta** que potenciará tu personaje de forma permanente durante la partida. La dificultad aumenta progresivamente: más enemigos, más rápidos.

Desarrollado con **Vue 3**, **Phaser 3**, **Pinia** y **Vite**.

---

## 📋 Requisitos previos

### Ejecución local
- [Node.js](https://nodejs.org/) v22 o superior
- [pnpm](https://pnpm.io/) v8

```bash
# Instalar pnpm v8 si no lo tienes
npm install -g pnpm@8
```

### Ejecución con Docker
- [Docker](https://www.docker.com/) v20 o superior

---

## 🚀 Ejecutar la aplicación localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoV1402/Solemne_2
cd demon-threshold
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en: **http://localhost:5173**

### 4. (Opcional) Compilar para producción

```bash
pnpm build
```

Los archivos compilados se generarán en la carpeta `dist/`.

### 5. (Opcional) Previsualizar el build de producción

```bash
pnpm preview
```

---

## 🐳 Ejecutar la aplicación con Docker


> La forma más rápida, sin necesidad de clonar el repositorio.

```bash
# Descargar y ejecutar la imagen
docker run -p 8080:80 diegov1402/demon-threshold:latest
```

La aplicación estará disponible en: **http://localhost:8080**

Para detener el contenedor:

```bash
docker stop demon-threshold
docker rm demon-threshold
```

---



## 🔗 Repositorio en Docker Hub

➡️ **[Link Docker Hub](https://hub.docker.com/r/diegov1402/demon-threshold)**

---

## 🎮 Cómo jugar

| Acción | Control |
|---|---|
| Moverse | `W` `A` `S` `D` |
| Atacar | Mantener presionado el botón izquierdo del mouse o apretar la tecla espacio|
| Apuntar | Mover el cursor hacia el objetivo |

1. Inicia el juego y presiona **Jugar**.
2. Dirigete hacia la primera salay dispara para eliminar a los enemigos.
3. Derrota enemigos para llenar la barra de experiencia.
4. Al subir al nivel 4, elige una de las **Bendiciones Corruptas** disponibles.
5. Avanza las salas para derrotar al boss.
6. Si tu vida llega a cero, se muestran tus resultados y puedes **Reintentar**.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| [Vue 3](https://vuejs.org/) | Framework principal de la UI |
| [Phaser 3](https://phaser.io/) | Motor del juego (renderizado, física, escenas) |
| [Pinia](https://pinia.vuejs.org/) | Gestión del estado global (vida, nivel, estadísticas) |
| [Vite](https://vitejs.dev/) | Empaquetador (bundler) del código y servidor de desarrollo rápido con recarga automática |

---

## 👥 Créditos

- Manuel Figueroa
- Diego Vargas
