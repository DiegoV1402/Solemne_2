# 👹 Documento de Diseño de Software: Demon Threshold

## 1. Descripción del Juego
**Demon Threshold** es un videojuego de acción y supervivencia en 2D perteneciente al género *roguelike*. El jugador debe adentrarse y sobrevivir en mazmorras infestadas de enemigos que lo perseguirán activamente en tiempo real. 

La mecánica principal requiere que el usuario se desplace en cuatro direcciones para esquivar los ataques y contraataque disparando proyectiles hacia la posición del cursor del mouse. Al derrotar a los adversarios se obtienen puntos de experiencia que permiten subir de nivel y desbloquear "Bendiciones Corruptas", las cuales incrementan de manera permanente las estadísticas de daño, velocidad y vida máxima durante el transcurso de la partida.

---

## 2. Mecánicas de Juego (Cómo Jugar)
* **Inicio:** El usuario interactúa con la interfaz del menú principal y selecciona la opción “Jugar”.
* **Movimiento:** Control del avatar del personaje mediante el mapeo de las teclas `W`, `A`, `S` y `D`.
* **Ataque:** Apuntar con el cursor hacia la dirección del objetivo y mantener presionado el botón izquierdo del mouse (o la barra espaciadora) para ejecutar ataques continuos con la espada o proyectiles.
* **Estrategia:** Evitar el contacto físico directo con los enemigos para mitigar la pérdida de puntos de vida.
* **Progresión:** Eliminar enemigos para acumular experiencia. Al completarse la barra de experiencia, el juego se pausa para permitir la selección de una mejora permanente (Bendición Corrupta) entre tres opciones aleatorias.
* **Fin de Partida:** Si los puntos de vida llegan a cero, la sesión concluye de inmediato, se guardan las estadísticas obtenidas y se habilita la opción de "Reintentar".

---

## 3. Reglas del Juego
1. **Atributos Iniciales:** El jugador inicia cada sesión con un valor de vida base parametrizado y fijo.
2. **Condición de Derrota:** La partida finaliza de forma abrupta cuando la vida del jugador decrece hasta cero.
3. **Comportamiento de la IA:** Los enemigos aparecen dinámicamente en los límites de las salas y computan algoritmos de persecución activa hacia las coordenadas del jugador.
4. **Cálculo de Daño:** El solapamiento de las cajas de colisión (*hitboxes*) de los enemigos con la del jugador descuenta puntos de vida según el daño base del enemigo.
5. **Permanencia de Mejoras:** Las Bendiciones Corruptas seleccionadas se acumulan de manera aditiva y se mantienen activas durante toda la partida actual. Al morir, el estado del personaje se restablece por completo y las mejoras no se transfieren a la nueva sesión.
6. **Escalabilidad de la Dificultad:** La dificultad del entorno se incrementa de forma progresiva a medida que el usuario avanza de sala (mayor volumen de enemigos, incremento de su velocidad base y daño).

---

## 4. Flujo del Juego (Workflow)

### 4.1. Inicio y Autenticación
* Se presenta la pantalla de Login/Registro de usuarios para autenticar la cuenta contra la base de datos.
* Tras iniciar sesión con éxito, se despliega el Menú Principal con las siguientes opciones jerárquicas: *Jugar*, *Opciones*, *Créditos*, *Leaderboard (Tabla de Clasificación)* y *Salir*.
* Al presionar el botón de juego, la aplicación realiza las peticiones necesarias al backend, inicializa la instancia base del personaje (vida, nivel, estadísticas) y genera la primera sala de la mazmorra.

### 4.2. Gameplay Dinámico
* El jugador se desplaza y ejecuta ataques en tiempo real dentro del lienzo gráfico administrado por el motor.
* Al ingresar a una nueva pieza o sección de la dungeon, las puertas se bloquean físicamente y se gestiona el *spawn* de enemigos.
* Cada enemigo eliminado envía señales al gestor de estado para añadir puntos de experiencia.
* Al alcanzar el umbral de experiencia requerido, el bucle lógico del motor de física se pausa. Se superpone un menú reactivo con tres cartas de "Bendiciones Corruptas" que permiten la compra de bufos o el intercambio de armas.
* Cuando la vida del personaje llega a cero, el bucle principal de juego se detiene por completo y se invoca la interfaz de Game Over. En esta pantalla se realiza una petición asíncrona hacia el servidor para registrar los datos obtenidos en la sesión y se procesa en tiempo real la tabla de mejores puntajes locales.

### 4.3. Reinicio
* Se habilita la opción interactiva de “Reintentar”. Al accionarse, se limpia la memoria caché visual de Phaser, se reinicia el ciclo vital del personaje a sus valores base y se genera un nuevo mapa aleatorio.

---

## 5. Especificaciones de Tecnología y Justificación

Para el desarrollo de *Demon Threshold*, se ha estructurado una arquitectura Fullstack robusta, desacoplando el renderizado de la vista del cliente, la API de servicios lógicos y el almacenamiento persistente.

### 5.1. Frontend y Motor de Videojuegos
* **Vue.js 3:** Se utiliza como el marco de trabajo principal de la interfaz de usuario. Se implementa por su sistema reactivo y la arquitectura basada en componentes, permitiendo orquestar elementos superpuestos al canvas del juego (tales como barras de salud, pantallas de carga, formularios de login y menús de pausa) de forma modular, eficiente y limpia, sin inyectar sobrecarga en el bucle principal de renderizado gráfico.
* **Phaser 3:** Es el motor de videojuegos encargado de procesar la lógica del gameplay en 2D. Es una dependencia crítica para el proyecto porque ofrece sistemas optimizados de renderizado acelerado por hardware (WebGL/Canvas), un motor físico nativo (Arcade Physics), animaciones de hojas de sprites y un árbol de eventos avanzado para el manejo exacto de colisiones y proyectiles asíncronos en tiempo real.
* **Pinia:** Gestor oficial de estado global de la aplicación. Su implementación es fundamental para centralizar las variables que deben compartirse entre la simulación física de Phaser y la interfaz web de Vue (puntos de vida actuales, nivel del jugador, experiencia acumulada y salas completadas), garantizando una única fuente de verdad reactiva durante toda la ejecución de la partida.
* **Vite:** Herramienta de empaquetado y entorno de desarrollo. Su integración se justifica por su velocidad de compilación basada en ESM nativos y su funcionalidad de Hot Module Replacement (HMR), acelerando significativamente el desarrollo y el balanceo de estadísticas del videojuego al actualizar módulos en tiempo real sin reiniciar el estado de la aplicación.

### 5.2. Backend y Persistencia de Datos
* **Node.js con Express (API REST):** Framework para el desarrollo del servidor backend. Su arquitectura asíncrona basada en eventos proporciona un rendimiento óptimo para procesar peticiones masivas e instantáneas de autenticación de usuarios y la actualización/consulta frecuente de la tabla de clasificación global. Al utilizar JavaScript en todo el stack, se reduce la fricción en el intercambio de modelos de datos.
* **MongoDB:** Base de datos NoSQL de tipo orientada a documentos. Se justifica su uso debido a la naturaleza dinámica de las métricas generadas en los videojuegos estilo *roguelike* (donde las estadísticas de partidas, registros de movimientos e inventarios de mejoras acumuladas varían de estructura constantemente). Un esquema flexible basado en BSON/JSON es considerablemente más escalable y rápido que las restricciones impuestas por un modelo relacional tradicional.

### Estructura de carpeta
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── main.yml               
│
├── 📁 backend/                    
│   │
│   ├── 📁 controllers/            
│   ├── 📁 models/                 
│   ├── 📁 routes/                 
│   ├── 📁 services/               
│   ├── 📁 tests/                  
│   ├── .env                       
│   ├── Dockerfile                 
│   ├── index.js                   
│   └── package.json               
│ 
├── 📁 src/                        
│   │
│   ├── 📁 components/
│   │   └── 📁 game/
│   │
│   ├── 📁 game/               
│   │   └── 📁 scenes/
│   │
│   ├── 📁 views/          
│   │
│   ├── 📁 stores/         
│   │
│   ├── 📁 styles/         
│   │     
│   ├── 📁 systems/   
│   │
│   ├── 📁 entities/       
│   │
│   ├── App.vue            
│   └── main.js            
│
├── compose.yml                    
├── Dockerfile                     
├── index.html             
├── package.json   
├── pnpm-lock.yaml
├── pnpm-workspace.yaml        
├── vite.config.js         
└── .gitignore

