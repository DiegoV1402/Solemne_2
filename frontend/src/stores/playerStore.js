// stores/playerStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PLAYER_BASE, PLAYER_CLASSES, DEFAULT_CLASS } from '@/entities/playerConfig'

export const usePlayerStore = defineStore('player', () => {
  // Clase elegida por el jugador en el menú: 'melee' | 'mage'
  const characterClass = ref(DEFAULT_CLASS)

  const maxHp    = ref(PLAYER_BASE.maxHp)
  const hp       = ref(PLAYER_BASE.maxHp)
  const speed    = ref(PLAYER_BASE.speed)
  const damage   = ref(PLAYER_BASE.damage)
  const level    = ref(1)
  const xp       = ref(0)
  const xpToNext = ref(PLAYER_BASE.xpToNext)

  // true cuando toca pantalla de mejoras (cada 4 niveles)
  const pendingUpgrade = ref(false)

  const hpPercent = computed(() => Math.max(0, (hp.value / maxHp.value) * 100))
  const xpPercent = computed(() => Math.min(100, (xp.value / xpToNext.value) * 100))
  const isAlive   = computed(() => hp.value > 0)

  const classInfo = computed(() => PLAYER_CLASSES[characterClass.value] ?? PLAYER_CLASSES[DEFAULT_CLASS])

  // Si se pasa `className`, cambia de clase; si no, mantiene la clase actual.
  function reset(className = characterClass.value) {
    characterClass.value = PLAYER_CLASSES[className] ? className : DEFAULT_CLASS
    const base = PLAYER_CLASSES[characterClass.value].base

    maxHp.value       = base.maxHp
    hp.value          = base.maxHp
    speed.value       = base.speed
    damage.value      = base.damage
    level.value       = 1
    xp.value          = 0
    xpToNext.value    = base.xpToNext
    pendingUpgrade.value = false
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

      // Cada 4 niveles → pantalla de mejoras
      if (level.value % 4 === 0) {
        pendingUpgrade.value = true
      }

      return true
    }
    return false
  }

  // Aplicar la mejora elegida por el jugador
  function applyUpgrade(upgradeId) {
    switch (upgradeId) {
      case 'damage':
        damage.value = Math.round(damage.value * 1.15)
        break
      case 'speed':
        speed.value = Math.round(speed.value * 1.10)
        break
      case 'maxHp':
        maxHp.value = Math.round(maxHp.value * 1.20)
        hp.value    = Math.min(hp.value + Math.round(maxHp.value * 0.10), maxHp.value)
        break
      case 'healHp':
        hp.value = Math.min(hp.value + Math.round(maxHp.value * 0.30), maxHp.value)
        break
      case 'damageSpeed':
        damage.value = Math.round(damage.value * 1.08)
        speed.value  = Math.round(speed.value  * 1.05)
        break
    }
    pendingUpgrade.value = false
  }

  return {
    characterClass, classInfo,
    maxHp, hp, speed, damage, level, xp, xpToNext, pendingUpgrade,
    hpPercent, xpPercent, isAlive,
    reset, takeDamage, gainXp, applyUpgrade
  }
})
