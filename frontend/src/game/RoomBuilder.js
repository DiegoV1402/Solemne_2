// game/RoomBuilder.js
// FIX CRÍTICO: build() devuelve visualObjects[] con TODOS los objetos
// gráficos creados. GameScene los guarda y destruye al cambiar de sala.
// Antes: el suelo creaba 1 Graphics por tile → 216 objetos que jamás
// se limpiaban → acumulación → freeze en sala 3+.
// Ahora: un solo Graphics por categoría (suelo, grietas, ambiente).

import Phaser from 'phaser'
import { DOOR_DEFS } from '@/game/data/dungeonMap'

const GAME_W = 900, GAME_H = 600, TILE = 50
const COLS = Math.ceil(GAME_W / TILE)   // 18
const ROWS = Math.ceil(GAME_H / TILE)   // 12

const THEMES = [
  { floor: 0x13131c, wall: 0x1a1a28, accent: 0x7b2fff, crack: 0x7b2fff },
  { floor: 0x130808, wall: 0x281a1a, accent: 0xff3333, crack: 0xff2200 },
  { floor: 0x080a13, wall: 0x1a1c28, accent: 0x3388ff, crack: 0x2244cc },
  { floor: 0x0a1308, wall: 0x1a2818, accent: 0x44ff44, crack: 0x226622 },
  { floor: 0x130d08, wall: 0x281e1a, accent: 0xff8833, crack: 0xcc4400 },
]

export class RoomBuilder {
  /**
   * @returns {{ walls, obstacles, visualObjects }}
   */
  static build(scene, roomId, layoutName, doorDirs = []) {
    const normalizedRoomId = Number.isFinite(Number(roomId)) ? Number(roomId) : 0
    const themeIndex      = normalizedRoomId % THEMES.length
    const theme           = THEMES[themeIndex] ?? THEMES[0]
    const skipSet         = new Set()

    for (const dir of doorDirs) {
      DOOR_DEFS[dir]?.skipTiles.forEach(({ row, col }) => skipSet.add(`${row},${col}`))
    }

    // Recopilar TODOS los objetos visuales para que GameScene los destruya
    const visualObjects = []

    const walls     = scene.physics.add.staticGroup()
    const obstacles = scene.physics.add.staticGroup()

    // ── Suelo (UN SOLO objeto Graphics, no uno por tile) ────
    const floorGfx = scene.add.graphics().setDepth(0)
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * TILE, y = row * TILE
        floorGfx.fillStyle(theme.floor, 1)
        floorGfx.fillRect(x, y, TILE, TILE)
        if ((row + col) % 3 === 0) {
          floorGfx.fillStyle(0x000000, 0.07)
          floorGfx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4)
        }
        floorGfx.lineStyle(1, 0xffffff, 0.025)
        floorGfx.strokeRect(x, y, TILE, TILE)
      }
    }
    visualObjects.push(floorGfx)

    // ── Paredes del borde (con gaps de puerta) ──────────────
    RoomBuilder._buildWalls(scene, walls, theme, skipSet)

    // ── Obstáculos del layout ───────────────────────────────
    const layoutObjects = RoomBuilder._buildLayout(scene, layoutName, obstacles, theme)
    layoutObjects.forEach(o => visualObjects.push(o))

    // ── Grietas decorativas (un solo Graphics) ──────────────
    const cracks = RoomBuilder._drawCracks(scene, theme.crack, 6)
    visualObjects.push(cracks)

    // ── Ambiente (polvo flotante) ────────────────────────────
    const dustCircles = RoomBuilder._drawAmbient(scene, theme)
    dustCircles.forEach(d => visualObjects.push(d))

    return { walls, obstacles, visualObjects }
  }

  // ── Paredes del borde ──────────────────────────────────────
  static _buildWalls(scene, walls, theme, skipSet) {
    const key = `wall_${theme.wall}`
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(theme.wall, 1);   g.fillRect(0, 0, TILE, TILE)
      g.lineStyle(1, 0xffffff, 0.07); g.strokeRect(1, 1, TILE - 2, TILE - 2)
      g.fillStyle(0xffffff, 0.04);  g.fillRect(4, 4, TILE - 8, 10)
      g.generateTexture(key, TILE, TILE); g.destroy()
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isBorder = row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1
        if (!isBorder || skipSet.has(`${row},${col}`)) continue
        const w = walls.create(col * TILE + TILE / 2, row * TILE + TILE / 2, key)
        w.setDisplaySize(TILE, TILE); w.refreshBody()
      }
    }
  }

  // ── Obstáculos por layout ──────────────────────────────────
  static _buildLayout(scene, layout, obstacles, theme) {
    const extras = []
    if (!scene || !obstacles || !theme) return extras

    switch (layout) {
      case 'pillars':   RoomBuilder._pillars(scene, obstacles, theme); break
      case 'cross':     RoomBuilder._cross(scene, obstacles, theme);   break
      case 'corridors': RoomBuilder._corridors(scene, obstacles, theme); break
      case 'arena':     RoomBuilder._arena(scene, obstacles, theme, extras); break
      default: break   // 'open' — sin obstáculos
    }
    return extras
  }

  static _pillars(scene, obs, theme) {
    [{ x: 250, y: 180 }, { x: 650, y: 180 },
     { x: 250, y: 420 }, { x: 650, y: 420 }]
      .forEach(p => RoomBuilder._obstacle(scene, obs, p.x, p.y, 58, 58, theme))
  }

  static _cross(scene, obs, theme) {
    const first = [[350,300], [400,300], [500,300], [550,300]]
    for (let i = 0; i < first.length; i++) {
      const [x, y] = first[i]
      RoomBuilder._obstacle(scene, obs, x, y, TILE, TILE, theme)
    }

    const second = [[450,150], [450,200], [450,400], [450,450]]
    for (let i = 0; i < second.length; i++) {
      const [x, y] = second[i]
      RoomBuilder._obstacle(scene, obs, x, y, TILE, TILE, theme)
    }
  }

  static _corridors(scene, obs, theme) {
    const left = [[200,150], [200,200], [200,350], [200,400], [200,450]]
    for (let i = 0; i < left.length; i++) {
      const [x, y] = left[i]
      RoomBuilder._obstacle(scene, obs, x, y, TILE, TILE, theme)
    }

    const right = [[700,150], [700,200], [700,350], [700,400], [700,450]]
    for (let i = 0; i < right.length; i++) {
      const [x, y] = right[i]
      RoomBuilder._obstacle(scene, obs, x, y, TILE, TILE, theme)
    }

    const center = [[450,200], [450,400]]
    for (let i = 0; i < center.length; i++) {
      const [x, y] = center[i]
      RoomBuilder._obstacle(scene, obs, x, y, 40, 40, theme)
    }
  }

  static _arena(scene, obs, theme, extras) {
    const cx = GAME_W / 2, cy = GAME_H / 2
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      RoomBuilder._obstacle(scene, obs,
        cx + Math.cos(a) * 150, cy + Math.sin(a) * 150, 44, 44, theme)
    }
    RoomBuilder._obstacle(scene, obs, cx, cy, 50, 50, theme)
  }

  // ── Obstacle helper ────────────────────────────────────────
  static _obstacle(scene, group, x, y, w, h, theme) {
    if (!scene || !scene.textures || !scene.make || !group || !group.create || !theme) {
      return
    }

    const wallColor = theme.wall ?? 0x999999
    const accent    = theme.accent ?? 0x777777
    const key       = `obs_${wallColor}_${w}_${h}`
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(wallColor, 1);     g.fillRect(0, 0, w, h)
      g.lineStyle(2, accent, 0.5);   g.strokeRect(1, 1, w - 2, h - 2)
      g.fillStyle(0xffffff, 0.05);    g.fillRect(3, 3, w - 6, 8)
      g.generateTexture(key, w, h);   g.destroy()
    }
    const o = group.create(x, y, key)
    if (!o) return
    o.setDisplaySize(w, h); o.refreshBody()
  }

  // ── Grietas (un Graphics, devuelto para tracking) ──────────
  static _drawCracks(scene, color, count) {
    const gfx = scene.add.graphics().setDepth(1).setAlpha(0.18)
    gfx.lineStyle(2, color, 1)
    for (let i = 0; i < count; i++) {
      const sx = Phaser.Math.Between(100, GAME_W - 100)
      const sy = Phaser.Math.Between(100, GAME_H - 100)
      let cx = sx, cy = sy
      gfx.beginPath(); gfx.moveTo(sx, sy)
      for (let j = 0; j < Phaser.Math.Between(2, 4); j++) {
        cx += Phaser.Math.Between(-60, 60)
        cy += Phaser.Math.Between(-40, 40)
        gfx.lineTo(cx, cy)
      }
      gfx.strokePath()
    }
    return gfx
  }

  // ── Polvo flotante (devuelve array de círculos) ────────────
  static _drawAmbient(scene, theme) {
    const circles = []
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, GAME_W - 100)
      const y = Phaser.Math.Between(100, GAME_H - 100)
      const d = scene.add.circle(x, y, 3, theme.accent, 0.5).setDepth(1)
      scene.tweens.add({
        targets: d, y: y - 20, alpha: { from: 0.5, to: 0 },
        duration: Phaser.Math.Between(2000, 4000), repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
        onRepeat: () => { d.setPosition(x + Phaser.Math.Between(-15, 15), y); d.setAlpha(0.5) }
      })
      circles.push(d)
    }
    return circles
  }
}
