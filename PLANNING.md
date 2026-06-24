# Planificación del Juego (Solemne 2)


##  Cronograma de Actividades

### 🔹 Semana 1
*Objetivo: Sentar las bases conceptuales y visuales.*
- [x] Definir la idea del juego (Roguelike).
- [x] Crear Mockups de las distintas pantallas de juego.
- [x] Crear archivos : `DESIGN.md` y `PLANNING.md`.



### 🔹 Semana 2
*Objetivo: Prototipado funcional en Vue.js.*
- [x] Investigar mas librerias para agregar en el proyecto.
- [x] Codificar la pantalla de inicio y el HUD.
- [x] Implementar el sistema de captura de teclas y movimiento del personaje.
- [x] Investigar sobre Phaser3 e introducir y probar en el codigo.

      



### 🔹 Semana 3
*Objetivo: Inteligencia artificial básica y colisiones.*
- [x] Añadir enemigos y lógica de persecución al jugador.
- [x] Implementar sistema de colisiones y daño.
- [x] Desarrollar la pantalla de muerte (Game Over).
- [x] Agregar gitignore e implementar actions.
- [x] Añadir la arquitectura de carpetas.


### 🔹 Semana 4
*Objetivo: Finalización del sistema y DevOps.*
- [x] Programar sistema de mejoras (power-ups).
- [x] Crear sistema de mazmorras (Dungeons) y cambio de niveles.
- [x] Crear `Dockerfile` y configurar `main.yml` (GitHub Actions).
- [x] Control de calidad: Verificación de bugs.
- [x] Redacción final del `README.md`.


---

# Planificación del Juego (Solemne 3)

## Cronograma de Actividades


### 🔹 Semana 1: Replanificación, Configuración Backend, Pruebas y CI/CD Inicial

* **Lunes 15/06:**
  - [x] Reestructurar el archivo `DESIGN.md`.
  - [x] Definir el nuevo cronograma en `PLANNING.md` con objetivos por clase/semana.
* **Martes 16/06:**
  - [x] Inicializar el entorno del servidor backend (Node.js/Express) utilizando `pnpm` como gestor de paquetes.
  - [x] Configurar la conexión inicial a la base de datos MongoDB.
* **Miércoles 17/06 y Jueves 18/06:**
  - [x] Diseñar el modelo de usuarios y desarrollar los endpoints de la API REST para registro, login y autenticación.
* **Viernes 19/06:**
  - [x] Implementar y configurar Linter en el proyecto (frontend y backend).
  - [x] Escribir e implementar pruebas unitarias básicas iniciales para el frontend y el backend.
* **Sábado 20/06 y Domingo 21/06:**
  - [x] Crear el `Dockerfile` independiente para el backend.
  - [x] Crear el archivo `compose.yml` en la raíz para orquestar los tres servicios: frontend, backend y MongoDB.
  - [x] Configurar el flujo en `.github/workflows/main.yml` para que al hacer push ejecute el Linter, las Pruebas Unitarias y realice el Build + Push de ambas imágenes (frontend y backend) hacia DockerHub.

📊 **Balance de la Semana 1:**
* **Lo que se logró completar:**
* **Lo que no se logró y el motivo:**

---

### 🔹 Semana 2: Integración Fullstack, Servicio Externo y Mecánicas

* **Lunes 22/06:**
  - [x] Modificar la lógica del sistema de ataque (eliminar la estela congelada de la espada).
* **Martes 23/06 y Miércoles 24/06:**
  - [ ] Conectar los formularios de login del cliente de Vue.js con los endpoints del backend para gestionar sesiones.
  - [ ] Programar la lógica persistente: enviar la información (puntaje, enemigos, nivel) a MongoDB al activarse la pantalla de muerte ("Tu destino ha sido sellado").
* **Jueves 25/06:**
  - [ ] Integrar el servicio REST externo gratuito.
* **Viernes 26/06 y Sábado 27/06:**
  - [ ] Implementar la Tabla de Clasificación (Leaderboard) obteniendo los datos desde el backend.
  - [ ] Modificar el sistema de "Bendiciones Corruptas" en el frontend para el intercambio o compra de potenciadores (cambios de armas y cartas).
* **Domingo 28/06:**
  - [ ] Refinar las pruebas unitarias (frontend y backend) garantizando que se verifiquen correctamente en GitHub Actions.

📊 **Balance de la Semana 2:**
* **Lo que se logró completar:** 
* **Lo que no se logró y el motivo:** 

---

### 🔹 Semana 3: Nuevos Enemigos y Entrega Final

* **Lunes 29/06:**
  - [ ] Desarrollar un nuevo enemigo de tipo rango (ataque a distancia) que se active dinámicamente solo en salas posteriores a la derrota del Boss final.
* **Martes 30/06:**
  - [ ] Ejecutar control de calidad funcional completo en los navegadores solicitados (Chrome, Firefox, Safari).
  - [ ] Redactar el archivo `README.md` asegurando que incluya el título, descripción, instrucciones detalladas de ejecución local (front y back), ejecución vía Docker Compose y los links a los repositorios de imágenes en DockerHub.
* **Jueves 02/07 (Día de la Entrega Final):**
  - [ ] Verificar exhaustivamente que el pipeline de GitHub Actions se ejecute sin errores en el último push.
  - [ ] Asegurar que el entorno levante correctamente ejecutando `docker compose up` sin intervención adicional.
  - [ ] Cierre oficial y congelamiento del repositorio para la revisión de notas.

📊 **Balance de la Semana 3:**
* **Lo que se logró completar:** 
* **Lo que no se logró y el motivo:** 