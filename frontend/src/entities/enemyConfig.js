// entities/enemyConfig.js

export const ENEMY_BASE = {
  hp:             40,
  speed:          110,
  damage:         8,
  xpReward:       20,
  detectionRange: 350,
  patrolRange:    80,
  attackCooldown: 1200,
  knockback:      180,
  type:           'melee',  // 'melee' | 'archer'
}

// Config específica del arquero
export const ARCHER_BASE = {
  hp:             25,
  speed:          70,          // se mueve menos
  damage:         12,          // flecha duele más
  xpReward:       30,
  detectionRange: 400,
  patrolRange:    60,
  attackCooldown: 2200,        // dispara más lento
  knockback:      120,
  type:           'archer',
  preferredDist:  220,         // distancia a mantener del jugador
  arrowSpeed:     340,
}

// Config específica del mago enemigo (aparece en las salas post-jefe)
export const MAGE_BASE = {
  hp:             30,
  speed:          65,           // lento, confía en el blink para escapar
  damage:         16,           // hechizo golpea fuerte
  xpReward:       38,
  detectionRange: 420,
  patrolRange:    60,
  attackCooldown: 2600,         // conjuro lento pero potente
  knockback:      140,
  type:           'mage',
  preferredDist:  260,          // distancia ideal para lanzar hechizos
  boltSpeed:      260,
  teleportCooldown: 4200,       // ms entre parpadeos (blink) para huir
  teleportRange:    170,        // distancia mínima a la que se teletransporta
}

export const ENEMY_SIZE  = 32
export const ARCHER_SIZE = 30
export const MAGE_SIZE   = 32

export const ENEMY_SPAWN = {
  initial:      3,
  perWave:      2,
  maxEnemies:   12,
  waveInterval: 15000,
  archerChance: 0.35,   // 35% de cada spawn es arquero
}
