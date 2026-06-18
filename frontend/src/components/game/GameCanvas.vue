<template>
  <!--
    game-wrapper: fondo negro full-screen.
    phaser-container: el canvas de Phaser (900×600) centrado.
    GameHUD: overlay encima del canvas (barras, tiempo, pausa).
    MinimapWidget: FUERA del canvas, posicionado en la esquina
                   del game-wrapper para no tapar el gameplay.
  -->
  <div class="game-wrapper">

    <!-- Canvas de Phaser -->
    <div ref="phaserContainer" class="phaser-container">
      <GameHUD />
    </div>

    <!-- Minimapa — en el espacio negro a la DERECHA del canvas -->
    <div class="minimap-slot">
      <MinimapWidget />
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { PreloadScene }   from '@/game/scenes/PreloadScene'
import { GameScene }      from '@/game/scenes/GameScene'
import GameHUD            from '@/components/game/GameHUD.vue'
import MinimapWidget      from '@/components/ui/MinimapWidget.vue'

const gameStore   = useGameStore()
const playerStore = usePlayerStore()

const phaserContainer = ref(null)
let   phaserGame      = null

const PHASER_CONFIG = {
  type: Phaser.AUTO,
  width:  900,
  height: 600,
  backgroundColor: '#08080f',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [PreloadScene, GameScene]
}

onMounted(() => {
  PHASER_CONFIG.parent = phaserContainer.value
  phaserGame = new Phaser.Game(PHASER_CONFIG)
})

onUnmounted(() => {
  if (phaserGame) { phaserGame.destroy(true); phaserGame = null }
})

watch(
  () => gameStore.phase,
  (newPhase, oldPhase) => {
    if (!phaserGame) return
    const PAUSE_STATES = ['paused', 'upgrading', 'gameover', 'victory']

    if (PAUSE_STATES.includes(newPhase)) {
      if (phaserGame.scene.isActive('GameScene')) {
        phaserGame.scene.pause('GameScene')
      }
    }

    if (newPhase === 'playing') {
      if (phaserGame.scene.isPaused('GameScene')) {
        phaserGame.scene.resume('GameScene')
      }
    }

    if (newPhase === 'menu') {
      phaserGame.destroy(true)
      phaserGame = null
    }
  }
)
</script>

<style scoped>
/* Contenedor full-screen con fondo negro */
.game-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #08080f;
  overflow: hidden;
}

/* Canvas de Phaser centrado */
.phaser-container {
  position: relative;
  width: 900px;
  height: 600px;
  flex-shrink: 0;
  box-shadow:
    0 0 0 2px #1a1a28,
    0 0 40px rgba(123, 47, 255, 0.18);
}

/*
  Slot del minimapa.
  Se posiciona en la esquina inferior-derecha de la PANTALLA,
  no del canvas, así nunca tapa el gameplay.
*/
.minimap-slot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 50;
}
</style>
