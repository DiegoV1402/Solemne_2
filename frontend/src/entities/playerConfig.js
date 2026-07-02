// entities/playerConfig.js
// Valores base del jugador. Cambiar aquí para rebalancear.

// ── GUERRERO (melee) — combate cuerpo a cuerpo con espada ─────────
export const PLAYER_BASE = {
  maxHp:     100,
  speed:     230,   // px/segundo — Phaser Arcade Physics
  damage:    15,
  xpToNext:  50,
}

// ── MAGO (rango) — ataca a distancia, menos vida pero pega más fuerte ──
export const MAGE_BASE = {
  maxHp:     70,    // 30% menos vida que el guerrero
  speed:     230,
  damage:    20,    // ~33% más daño por impacto que el guerrero
  xpToNext:  50,
}

export const PLAYER_SIZE = 36

// ── Definición de clases jugables ──────────────────────────────────
// `texture` referencia la textura generada en PreloadScene.
// `attack` identifica qué sistema de ataque debe instanciar GameScene.
export const PLAYER_CLASSES = {
  melee: {
    id:      'melee',
    label:   'Guerrero',
    icon:    '⚔️',
    texture: 'player',
    attack:  'sword',
    base:    PLAYER_BASE,
    desc:    'Combate cuerpo a cuerpo. Más vida, golpea con la espada en un arco corto.',
  },
  mage: {
    id:      'mage',
    label:   'Mago',
    icon:    '🧙',
    texture: 'player-mage',
    attack:  'staff',
    base:    MAGE_BASE,
    desc:    'Ataca a distancia con proyectiles arcanos. Menos vida, pero cada impacto pega más fuerte.',
  },
}

export const DEFAULT_CLASS = 'melee'
