<template>
  <div class="game-wrapper">
    <div ref="phaserContainer" class="phaser-container" />
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

function destroyPhaser() {
  if (phaserGame) {
    phaserGame.destroy(true)
    phaserGame = null
  }
}

onMounted(() => {
  PHASER_CONFIG.parent = phaserContainer.value
  phaserGame = new Phaser.Game(PHASER_CONFIG)
})

onUnmounted(() => destroyPhaser())

watch(
  () => gameStore.phase,
  (newPhase, oldPhase) => {
    if (!phaserGame) return
    const scene = phaserGame.scene.getScene('GameScene')

    if (newPhase === 'paused') {
      if (scene) phaserGame.scene.pause('GameScene')
    }

    if (newPhase === 'playing' && oldPhase === 'paused') {
      if (scene) phaserGame.scene.resume('GameScene')
    }

    // FIX: gameover → pausar Phaser para que no siga corriendo
    if (newPhase === 'gameover') {
      if (scene) phaserGame.scene.pause('GameScene')
    }

    if (newPhase === 'menu') {
      destroyPhaser()
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
  box-shadow:
    0 0 0 2px #1a1a28,
    0 0 40px rgba(123, 47, 255, 0.2),
    0 0 80px rgba(0,0,0,0.8);
}
</style>
