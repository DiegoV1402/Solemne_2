// entities/player.js
// Estadísticas BASE del jugador al comenzar una partida.
// Modificar aquí para rebalancear sin tocar la lógica.

export const PLAYER_BASE = {
  maxHp:     100,     // vida máxima inicial
  speed:     220,     // píxeles por segundo
  damage:    15,      // daño por proyectil
  xpToNext:  80,      // XP necesaria para nivel 2

  // Tamaño del sprite (debe coincidir con el CSS)
  width:  36,
  height: 36,
}
