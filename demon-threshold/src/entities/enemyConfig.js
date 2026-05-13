// entities/enemyConfig.js
// Configuración base de enemigos. Ajustar para rebalancear.

export const ENEMY_BASE = {
  hp:           40,
  speed:        110,      // px/segundo (más lento que el jugador)
  damage:       8,        // daño por contacto
  xpReward:     20,
  detectionRange: 350,   // px — radio en que detecta al jugador
  patrolRange:    80,    // px — rango de patrulla cuando no detecta
  attackCooldown: 1200,  // ms entre ataques
  knockback:      180,   // impulso al golpear al jugador
}

export const ENEMY_SIZE = 32

// Cuántos spawn al inicio y cuántos añadir cada ronda
export const ENEMY_SPAWN = {
  initial: 3,
  perWave: 2,
  maxEnemies: 12,
  waveInterval: 15000, // ms entre oleadas
}
