// stores/gameStore.js
// Estado global del juego con sistema de dungeon basado en salas.

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DUNGEON_MAP } from '@/game/data/dungeonMap'

import { useAuthStore } from './authStore'
import { usePlayerStore } from './playerStore'

export const useGameStore = defineStore('game', () => {

  // ── Fase del juego ─────────────────────────────────────────
  // 'menu' | 'playing' | 'paused' | 'upgrading' | 'gameover' | 'victory'
  const phase = ref('menu')

  // ── Estadísticas de partida ────────────────────────────────
  const elapsedMs       = ref(0)
  const enemiesDefeated = ref(0)

  // ── Dungeon ────────────────────────────────────────────────
  // Copia del mapa que se modifica durante la partida (cleared, visited)
  const dungeonRooms   = ref({})
  const currentRoomId  = ref(0)

  // ── Dificultad escala con el número de sala ─────────────────
  const roomNumber = computed(() => currentRoomId.value + 1)

  const difficulty = computed(() => {
    const n = currentRoomId.value
    return {
      hpMult:       1 + n * 0.22,
      speedMult:    1 + n * 0.08,
      damageMult:   1 + n * 0.13,
      archerChance: Math.min(0.30 + n * 0.06, 0.65),
      maxEnemies:   Math.min(4 + n * 2, 18),
      spawnCount:   Math.min(3 + Math.floor(n * 0.8), 7),
      waveInterval: Math.max(14000 - n * 1000, 6000),
    }
  })

  // ── Getters ────────────────────────────────────────────────
  const isPlaying = computed(() => phase.value === 'playing')
  const isPaused  = computed(() => phase.value === 'paused')

  const currentRoom = computed(() => dungeonRooms.value[currentRoomId.value] ?? null)

  const roomLabel = computed(() => {
    const r = currentRoom.value
    if (!r) return ''
    if (r.type === 'boss')  return '⚠ SALA JEFE ⚠'
    // Sala 0 (inicio) → "SALA 1", sala 1 → "SALA 2", etc.
    return r.type === 'start'
      ? 'SALA 1  (INICIO)'
      : `SALA ${currentRoomId.value + 1}`
  })

  const elapsedFormatted = computed(() => {
    const s   = Math.floor(elapsedMs.value / 1000)
    const min = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${min}:${sec}`
  })

  async function saveSessionData() {
    const authStore = useAuthStore()
    const playerStore = usePlayerStore() 

    // Si el usuario no ha iniciado sesión, no guardamos en MongoDB
    if (!authStore.token) return

    try {
      const response = await fetch('http://localhost:3000/api/games/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
          // Calculamos un puntaje base (puedes ajustar esta fórmula a tu gusto)
          score: enemiesDefeated.value * 100, 
          // Extraemos el nivel alcanzado desde el store del jugador
          level: playerStore.level || 1,      
          enemiesDefeated: enemiesDefeated.value
        })
      })

      const data = await response.json()
      if (response.ok) {
        console.log('✅ Base de datos:', data.message)
      } else {
        console.error('❌ Error de servidor:', data.message)
      }
    } catch (error) {
      console.error('Fallo de red al intentar guardar la partida:', error)
    }
  }

  // ── Acciones ───────────────────────────────────────────────
  function startGame() {
    phase.value           = 'playing'
    elapsedMs.value       = 0
    enemiesDefeated.value = 0
    currentRoomId.value   = DUNGEON_MAP.startRoom

    // Clonar mapa para no mutar el original
    const clone = {}
    Object.values(DUNGEON_MAP.rooms).forEach(room => {
      clone[room.id] = { ...room }
    })
    dungeonRooms.value = clone
  }

  // Entrar a una sala (GameScene lo llama al hacer transición)
  function enterRoom(id) {
    currentRoomId.value = id
    if (dungeonRooms.value[id]) {
      dungeonRooms.value[id].visited = true
    }
    phase.value = 'playing'
  }

  // Marcar sala actual como completada (EnemyManager lo llama)
  function completeCurrentRoom() {
    const id = currentRoomId.value
    if (dungeonRooms.value[id]) {
      dungeonRooms.value[id].cleared = true
    }
    // No cambiamos phase aquí: las puertas se abren solas en Phaser
  }

  function isRoomCleared(id) {
    return dungeonRooms.value[id]?.cleared ?? false
  }

  function getRoomType(id) {
    return dungeonRooms.value[id]?.type ?? 'combat'
  }

  function togglePause() {
    if (phase.value === 'playing') phase.value = 'paused'
    else if (phase.value === 'paused') phase.value = 'playing'
  }

  function openUpgrade()  { phase.value = 'upgrading' }
  function closeUpgrade() { phase.value = 'playing' }

  // Al morir, cambiamos la vista y mandamos la info a MongoDB
  function gameOver()  { 
    phase.value = 'gameover' 
    saveSessionData() 
  }
  
  function victory()   { phase.value = 'victory' }
  function goToMenu()  { phase.value = 'menu' }

  function addTime(deltaMs) {
    if (phase.value === 'playing') elapsedMs.value += deltaMs
  }

  return {
    phase, elapsedMs, enemiesDefeated, dungeonRooms, currentRoomId,
    roomNumber, difficulty, isPlaying, isPaused,
    currentRoom, roomLabel, elapsedFormatted,
    startGame, enterRoom, completeCurrentRoom, isRoomCleared, getRoomType,
    togglePause, openUpgrade, closeUpgrade, gameOver, victory, goToMenu, addTime,
    saveSessionData // Exportamos la función por si se requiere en un botón manual más adelante
  }
})