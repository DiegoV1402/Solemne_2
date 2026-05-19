// stores/gameStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // 'menu' | 'playing' | 'paused' | 'upgrading' | 'gameover'
  const phase = ref('menu')

  const elapsedMs       = ref(0)
  const enemiesDefeated = ref(0)

  const isPlaying = computed(() => phase.value === 'playing')
  const isPaused  = computed(() => phase.value === 'paused')

  const elapsedFormatted = computed(() => {
    const s   = Math.floor(elapsedMs.value / 1000)
    const min = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${min}:${sec}`
  })

  function startGame() {
    phase.value           = 'playing'
    elapsedMs.value       = 0
    enemiesDefeated.value = 0
  }

  function togglePause() {
    if (phase.value === 'playing') phase.value = 'paused'
    else if (phase.value === 'paused') phase.value = 'playing'
  }

  function openUpgrade()  { phase.value = 'upgrading' }
  function closeUpgrade() { phase.value = 'playing' }

  function gameOver() { phase.value = 'gameover' }
  function goToMenu()  { phase.value = 'menu' }

  function addTime(deltaMs) {
    if (phase.value === 'playing') elapsedMs.value += deltaMs
  }

  return {
    phase, elapsedMs, enemiesDefeated,
    isPlaying, isPaused, elapsedFormatted,
    startGame, togglePause, gameOver, goToMenu, addTime,
    openUpgrade, closeUpgrade
  }
})
