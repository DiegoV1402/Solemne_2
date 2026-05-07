<template>
  <!--
    Este componente NUNCA se desmonta mientras el juego esté activo.
    El canvas de Phaser vive aquí. Si se destruye el componente, el canvas
    desaparece y se ve negro. Por eso en App.vue usamos v-else y no v-if
    separados para playing/paused.
  -->
  <div class="game-wrapper">
    <!-- Phaser inyecta su canvas aquí -->
    <div ref="phaserContainer" class="phaser-container" />

    <!-- HUD Vue encima del canvas (pointer-events: none para no bloquear input) -->
    <GameHUD />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { PreloadScene }   from '@/game/scenes/PreloadScene'
import { GameScene }      from '@/game/scenes/GameScene'
import GameHUD from './GameHUD.vue'

const gameStore   = useGameStore()
const playerStore = usePlayerStore()

const phaserContainer = ref(null)
let   phaserGame      = null   // instancia de Phaser.Game

// ── Configuración de Phaser ──────────────────────────────
const PHASER_CONFIG = {
  type: Phaser.AUTO,        // WebGL si disponible, Canvas como fallback
  width:  900,
  height: 600,
  backgroundColor: '#08080f',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },    // top-down: sin gravedad
      debug: false          // cambiar a true para ver hitboxes
    }
  },
  scene: [PreloadScene, GameScene]
}

// ── Montar Phaser cuando el DOM está listo ────────────────
onMounted(() => {
  PHASER_CONFIG.parent = phaserContainer.value

  phaserGame = new Phaser.Game(PHASER_CONFIG)

  // Phaser tarda un tick en crear la escena; esperamos antes de pausar
  phaserGame.events.once('ready', () => {
    // Si el store ya está en 'paused' (no debería, pero por seguridad)
    if (gameStore.isPaused) pausePhaser()
  })
})

// ── Destruir Phaser al salir del componente ────────────────
onUnmounted(() => {
  if (phaserGame) {
    phaserGame.destroy(true)
    phaserGame = null
  }
})

// ── ⚡ LA CLAVE: Watch de fase → pausa/reanuda Phaser ──────
//
// Este watcher es la solución al bug de "pantalla negra al pausar".
//
// El error anterior: al cambiar 'phase' a 'paused', Vue re-evaluaba
// el template y DESMONTABA el componente que contenía el canvas.
// Phaser perdía su target y quedaba negro.
//
// La solución:
//   1. GameView/App NUNCA desmonta GameCanvas mientras phase !== 'menu'
//   2. Este watch llama al API de Phaser para congelar/reanudar la escena
//   3. El canvas sigue visible y renderizando el último frame
// ─────────────────────────────────────────────────────────
watch(
  () => gameStore.phase,
  (newPhase, oldPhase) => {
    if (!phaserGame) return

    const scene = phaserGame.scene.getScene('GameScene')
    if (!scene) return

    if (newPhase === 'paused') {
      // Congela update() de la escena pero mantiene el canvas visible
      phaserGame.scene.pause('GameScene')
    }

    if (newPhase === 'playing' && oldPhase === 'paused') {
      // Reanuda el update() de la escena
      phaserGame.scene.resume('GameScene')
    }

    if (newPhase === 'menu') {
      // Al volver al menú, destruir Phaser (se recrea al entrar al juego)
      phaserGame.destroy(true)
      phaserGame = null
    }
  }
)
</script>

<style scoped>
.game-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #08080f;
}

.phaser-container {
  position: relative;
  width: 900px;
  height: 600px;
  /* Borde decorativo alrededor del canvas */
  box-shadow:
    0 0 0 2px #1a1a28,
    0 0 40px rgba(123, 47, 255, 0.2),
    0 0 80px rgba(0,0,0,0.8);
}
</style>
