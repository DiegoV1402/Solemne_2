<template>
  <div id="app-root">
    <!--
      MenuView se muestra solo en 'menu'.
      GameView NUNCA se desmonta mientras estemos jugando o pausados,
      porque contiene el canvas de Phaser — desmontarlo lo destruiría
      y eso causa la pantalla negra.
    -->
    <MenuView v-if="gameStore.phase === 'menu'" />
    <GameView v-else />
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
import MenuView from '@/views/MenuView.vue'
import GameView from '@/views/GameView.vue'

const gameStore = useGameStore()
</script>

<style scoped>
#app-root { width: 100vw; height: 100vh; overflow: hidden; }
</style>
