// game/data/dungeonMap.js
// 8 salas: Start → 6 Combat → Boss
//
// Layout visual (grid del minimapa):
//
// Col:  1     2     3     4     5
// Row1:              [5]
// Row2: [S=0] [1]   [2]  [4]  [Boss=7]
// Row3:        [3]  [6]

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
    7: { id: 7, type: 'boss',   layout: 'open',       cleared: false, visited: false, connections: { west: 4 } },
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
