**Descripcion del juego**
Demon Threshold es un juego 2D estilo roguelike donde el jugador debe sobrevivir a dungeos con enemigos que lo persiguen el jugador debera
moverse en cuatro direcciones evitando recibir daño y atacara disparando hacia el cursor manteniendo presionado el mouse.
Se gana experiencia al derrotar enemigos para as irecibir mejoras de estadísticas como daño, velocidad y vida.


**Como jugarlo**
Inicia el juego y selecciona la opción “Jugar”.
Mueve al personaje con las teclas W, A, S, D.
Mantén presionado el botón izquierdo del mouse para disparar.
Apunta con el cursor en la dirección donde quieres atacar.
Evita el contacto con los enemigos para no perder vida.
Derrota enemigos para ganar experiencia.
Al llenar la barra de experiencia, elige una mejora.
Selecciona una “Bendición Corrupta” para fortalecer tu personaje.
Si tu vida llega a cero, la partida termina y puedes reintentar. 


**Reglas del juego**
El jugador comienza cada partida con una cantidad especifica de vida
La partida termina cuando la vida llega a cero
Los enemigos aparece y persiguen al jugador
El contacto con los enemigos reduce la vida del jugador
El jugador puede atacar continuamente manteniendo presionado el mouse
Cada enemigo derrotado otorga experiencia
Al llenar la barra de experiencia, el jugador sube de nivel
En cada nivel se debe elegir una sola “Bendición Corrupta” entre tres opciones
Las mejoras son permanentes durante la partida y se acumulan al momento de morir no se guardan las mejoras que se seleccionaron previamente 
La dificultad aumenta progresivamente con el tiempo (más enemigos o más rápidos)
El objetivo es sobrevivir el mayor tiempo posible y alcanzar el nivel más alto

**Flujo del juego**
#Inicio
Se muestra la pantalla principal con las opciones: Jugar, Opciones, Créditos y Salir.
Cuando uno presiona el boton de jugar se inicia una nueva partida 
se genera el personaje base con el que se va a jugar  (vida, nivel, estadísticas)

#Gameplay 
El jugador se mueve y ataca en tiempo real
Los enemigos aparecen al entrar a una pieza de la dungeon y persiguen al jugador
El jugador recibe daño o elimina enemigos
Al derrotar enemigos se gana experiencia
La barra de experiencia se va llenando
Al momento de conseguir una cierta cantidad de experiencia el juego se pausa y
aparecen 3 opciones en la pantalla de “Bendiciones Corruptas”
Al momento de escoger una de las mejoras
Se aplican los cambios en el personaje tanto de habilidades o estadisticas 
al avanzar con el juego, la dificultad se empieza a notar mas dificil progresivamente 
Aumenta la cantidad y/o velocidad de los enemigos con el tiempo
Al momento de que el personaje su vida llegue a 0 el juego se detiene y se le muestra una pantalla donde salen sus resultados que obtuvo durante el juego 
Se muestran estadísticas como enemigos derrotados, tiempo y nivel alcanzado.

#Reinicio
Opción de “Reintentar”
Se reinicia el ciclo desde una nueva partida

**Especificaciones de tecnología**
#Pinia
Lo vamos a utilizar por el motivo de guardar datos globales de la partida como la vida máxima, daño acumulado o el nivel actual en el que se encuentra. Nos llamó la atención por la forma de escribir las variables y funciones, ya que se parece a JavaScript, las cuales las podemos llamar fácilmente.

#Vue.js
Lo usaremos porque tenemos más experiencia al momento de usarlo(Mas que Angular y React ya que no lo hemos visto).

#VueUse
La vamos a utilizar para el movimiento del jugador mediante el teclado, es decir, con las WASD. Lo que nos parecio interesante es que tiene una función que es onKeyStroke, la cual detecta las teclas al instante y, al momento de cambiar de pantalla, se apagan automáticamente, como cuando pausamos el juego.

HTML, CSS y JS
Los usaremos ya que tenemos mas experiencias puesto que lo aprendimos en clases.

#Phaser 3 
utilizaremos este engine para usarlo como motor principal para el desarrollo del juego 

#Vite
Vamos a usar vite para que el proyecto se inicie de una forma muy rapida y los cambios se reflejen sin tener que actualizar la pagina.

#Posiblemente se agreguen mas libreria mediante las utilicemos, las cuales las iremos añadiendo cuando las necesitemos.

