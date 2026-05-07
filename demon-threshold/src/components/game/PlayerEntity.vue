<template>
  <!--
    El jugador es un <div> posicionado absolutamente dentro del game-world.
    La posición se aplica con transform: translate para mejor rendimiento GPU.
    :class binding agrega .moving cuando el jugador se está moviendo.
  -->
  <div
    class="player"
    :class="{ moving: playerStore.isMoving, 'flip-left': playerStore.facing === 'left' }"
    :style="playerStyle"
    aria-label="Jugador"
  >
    <!-- Sombra en el suelo -->
    <div class="player-shadow" />

    <!-- Cuerpo del jugador (placeholder hasta tener sprites) -->
    <div class="player-body">
      <!-- Detalle decorativo: ojo / núcleo -->
      <div class="player-core" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import '@/styles/game.css'

const playerStore = usePlayerStore()

/**
 * Posiciona al jugador con transform en lugar de top/left
 * para que el navegador use la GPU y no genere reflows.
 */
const playerStyle = computed(() => ({
  transform: `translate(${playerStore.x}px, ${playerStore.y}px)`
}))
</script>

<style scoped>
/* Voltear sprite cuando mira a la izquierda */
.flip-left .player-body {
  transform: scaleX(-1);
}

/* Núcleo brillante dentro del jugador */
.player-core {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 6px #fff, 0 0 12px var(--color-accent);
  animation: corePulse 1.2s ease-in-out infinite;
}

@keyframes corePulse {
  0%, 100% { opacity: 1;    transform: translate(-50%, -50%) scale(1);    }
  50%       { opacity: 0.6; transform: translate(-50%, -50%) scale(0.75); }
}
</style>
