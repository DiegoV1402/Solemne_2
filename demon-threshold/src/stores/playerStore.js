// stores/playerStore.js
// Solo estadísticas del jugador. La posición la maneja Phaser.

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PLAYER_BASE } from '@/entities/playerConfig'

export const usePlayerStore = defineStore('player', () => {
  const maxHp    = ref(PLAYER_BASE.maxHp)
  const hp       = ref(PLAYER_BASE.maxHp)
  const speed    = ref(PLAYER_BASE.speed)
  const damage   = ref(PLAYER_BASE.damage)
  const level    = ref(1)
  const xp       = ref(0)
  const xpToNext = ref(PLAYER_BASE.xpToNext)

  const hpPercent = computed(() => Math.max(0, (hp.value / maxHp.value) * 100))
  const xpPercent = computed(() => Math.min(100, (xp.value / xpToNext.value) * 100))
  const isAlive   = computed(() => hp.value > 0)

  function reset() {
    maxHp.value    = PLAYER_BASE.maxHp
    hp.value       = PLAYER_BASE.maxHp
    speed.value    = PLAYER_BASE.speed
    damage.value   = PLAYER_BASE.damage
    level.value    = 1
    xp.value       = 0
    xpToNext.value = PLAYER_BASE.xpToNext
  }

  function takeDamage(amount) {
    hp.value = Math.max(0, hp.value - amount)
  }

  function gainXp(amount) {
    xp.value += amount
    if (xp.value >= xpToNext.value) {
      xp.value      -= xpToNext.value
      level.value   += 1
      xpToNext.value = Math.floor(xpToNext.value * 1.45)
      return true // level up!
    }
    return false
  }

  return {
    maxHp, hp, speed, damage, level, xp, xpToNext,
    hpPercent, xpPercent, isAlive,
    reset, takeDamage, gainXp
  }
})
