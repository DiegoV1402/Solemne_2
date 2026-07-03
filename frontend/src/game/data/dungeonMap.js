// game/data/dungeonMap.js
// 8 salas originales: Start → 6 Combat → Boss
// + 6 salas nuevas no lineales (con ramificaciones, igual que el resto del
// dungeon) pobladas por el enemigo Mago, que se desbloquean al derrotar al
// jefe final (7). Al fondo de esas salas espera un SEGUNDO jefe —un Señor
// Arquero, más difícil que el primero— cuya derrota dispara la victoria real.
//
// Layout visual (grid del minimapa):
//
// Col:  1     2     3     4     5        6     7     8     9
// Row1:              [5]                       [12]
// Row2: [S=0] [1]   [2]  [4]  [Boss=7]  [8]   [9]  [11]  [Boss2=14]
// Row3:        [3]  [6]              [10]  [13]

import Phaser from 'phaser'

export const DUNGEON_MAP = {
  startRoom: 0,
  rooms: {
    0: { id: 0, type: 'start',  layout: 'open',      cleared: true,  visited: true,  connections: { east: 1 } },
    1: { id: 1, type: 'combat', layout: 'pillars',    cleared: false, visited: false, connections: { west: 0, east: 2, south: 3 } },
    2: { id: 2, type: 'combat', layout: 'cross',      cleared: false, visited: false, connections: { west: 1, east: 4, north: 5 } },
    3: { id: 3, type: 'combat', layout: 'corridors',  cleared: false, visited: false, connections: { north: 1, east: 6 } },
    4: { id: 4, type: 'combat', layout: 'arena',      cleared: false, visited: false, connections: { west: 2, east: 7 } },
    5: { id: 5, type: 'combat', layout: 'pillars',    cleared: false, visited: false, connections: { south: 2 } },
    6: { id: 6, type: 'combat', layout: 'corridors',  cleared: false, visited: false, connections: { west: 3 } },
    7: { id: 7, type: 'boss',   layout: 'open',       cleared: false, visited: false, connections: { west: 4, east: 8 } },

    // ── Santuario del Mago (se desbloquea al matar al primer jefe) ──
    // Ramificado igual que el resto del dungeon, no lineal.
    8:  { id: 8,  type: 'combat', layout: 'pillars',   enemyPool: 'mage', sanctuaryEntry: true, cleared: false, visited: false, connections: { west: 7, east: 9, south: 10 } },
    9:  { id: 9,  type: 'combat', layout: 'cross',     enemyPool: 'mage', cleared: false, visited: false, connections: { west: 8, east: 11, north: 12 } },
    10: { id: 10, type: 'combat', layout: 'corridors', enemyPool: 'mage', cleared: false, visited: false, connections: { north: 8, east: 13 } },
    11: { id: 11, type: 'combat', layout: 'arena',     enemyPool: 'mage', cleared: false, visited: false, connections: { west: 9, east: 14 } },
    12: { id: 12, type: 'combat', layout: 'pillars',   enemyPool: 'mage', cleared: false, visited: false, connections: { south: 9 } },
    13: { id: 13, type: 'combat', layout: 'corridors', enemyPool: 'mage', cleared: false, visited: false, connections: { west: 10 } },

    // ── Segundo jefe: Señor Arquero (final real de la partida) ──
    14: { id: 14, type: 'boss', bossType: 'archer', final: true, layout: 'open',
          cleared: false, visited: false, connections: { west: 11 } },
  }
}

export const OPPOSITE_DIR = {
  north: 'south', south: 'north', east: 'west', west: 'east',
}

// Dónde aparece el jugador al entrar por cada pared
export const SPAWN_BY_ENTRY = {
  west:  { x: 110, y: 300 },
  east:  { x: 790, y: 300 },
  north: { x: 450, y: 110 },
  south: { x: 450, y: 490 },
}

// Definición de cada puerta: qué tiles saltar, bloque físico, zona trigger, flecha
export const DOOR_DEFS = {
  north: {
    skipTiles:  [{ row: 0, col: 8 }, { row: 0, col: 9 }],
    block:  { x: 450, y: 25,  w: 100, h: 50  },
    zone:   { x: 450, y: 18,  w: 90,  h: 36  },
    arrow:  { x: 450, y: 8 },
    arrowAngle: -Math.PI / 2,
  },
  south: {
    skipTiles:  [{ row: 11, col: 8 }, { row: 11, col: 9 }],
    block:  { x: 450, y: 575, w: 100, h: 50  },
    zone:   { x: 450, y: 585, w: 90,  h: 36  },
    arrow:  { x: 450, y: 592 },
    arrowAngle: Math.PI / 2,
  },
  east: {
    skipTiles:  [{ row: 5, col: 17 }, { row: 6, col: 17 }],
    block:  { x: 875, y: 300, w: 50,  h: 100 },
    zone:   { x: 885, y: 300, w: 36,  h: 90  },
    arrow:  { x: 892, y: 300 },
    arrowAngle: 0,
  },
  west: {
    skipTiles:  [{ row: 5, col: 0 }, { row: 6, col: 0 }],
    block:  { x: 25,  y: 300, w: 50,  h: 100 },
    zone:   { x: 15,  y: 300, w: 36,  h: 90  },
    arrow:  { x: 8,   y: 300 },
    arrowAngle: Math.PI,
  },
}
