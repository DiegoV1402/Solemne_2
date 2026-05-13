// game/scenes/PreloadScene.js
// Genera texturas placeholder con Graphics de Phaser.
// Cuando tengan sprites reales, reemplazar aquí con this.load.image(...)

import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  create() {
    // ── Textura del JUGADOR (círculo púrpura con glow) ────────
    const playerGfx = this.make.graphics({ x: 0, y: 0, add: false })

    // Sombra/halo exterior
    playerGfx.fillStyle(0x5500cc, 0.35)
    playerGfx.fillCircle(22, 22, 20)

    // Cuerpo principal
    playerGfx.fillStyle(0x7b2fff, 1)
    playerGfx.fillCircle(22, 22, 15)

    // Highlight
    playerGfx.fillStyle(0xaa77ff, 1)
    playerGfx.fillCircle(17, 16, 6)

    // Core brillante
    playerGfx.fillStyle(0xffffff, 1)
    playerGfx.fillCircle(16, 15, 3)

    playerGfx.generateTexture('player', 44, 44)
    playerGfx.destroy()

    // ── Textura del SUELO (losa oscura con cuadrícula) ────────
    const floorGfx = this.make.graphics({ x: 0, y: 0, add: false })

    floorGfx.fillStyle(0x13131c, 1)
    floorGfx.fillRect(0, 0, 50, 50)

    // Líneas de cuadrícula sutiles
    floorGfx.lineStyle(1, 0x1e1e30, 0.5)
    floorGfx.strokeRect(0, 0, 50, 50)

    // Variación aleatoria de color en la losa
    floorGfx.fillStyle(0x0f0f1a, 0.3)
    floorGfx.fillRect(2, 2, 20, 20)

    floorGfx.generateTexture('floor', 50, 50)
    floorGfx.destroy()

    // ── Textura de la PARED ───────────────────────────────────
    const wallGfx = this.make.graphics({ x: 0, y: 0, add: false })

    wallGfx.fillStyle(0x1a1a28, 1)
    wallGfx.fillRect(0, 0, 50, 50)

    wallGfx.lineStyle(1, 0x2a2a40, 0.8)
    wallGfx.strokeRect(1, 1, 48, 48)

    wallGfx.fillStyle(0x222235, 1)
    wallGfx.fillRect(4, 4, 42, 20)
    wallGfx.fillRect(4, 28, 42, 18)

    wallGfx.generateTexture('wall', 50, 50)
    wallGfx.destroy()

    // ── Textura del ENEMIGO (rombo rojo con brillo) ───────────
    const enemyGfx = this.make.graphics({ x: 0, y: 0, add: false })

    // Aura exterior
    enemyGfx.fillStyle(0x880000, 0.35)
    enemyGfx.fillCircle(22, 22, 20)

    // Cuerpo rojo oscuro
    enemyGfx.fillStyle(0xcc1111, 1)
    enemyGfx.fillCircle(22, 22, 14)

    // Detalle interior
    enemyGfx.fillStyle(0xff3333, 1)
    enemyGfx.fillCircle(17, 16, 7)

    // Ojo brillante
    enemyGfx.fillStyle(0xffffff, 1)
    enemyGfx.fillCircle(16, 15, 3)

    // Pupila
    enemyGfx.fillStyle(0x000000, 1)
    enemyGfx.fillCircle(17, 16, 1.5)

    // Cuernos (triángulos)
    enemyGfx.fillStyle(0x880000, 1)
    enemyGfx.fillTriangle(16, 8, 12, 0, 20, 0)
    enemyGfx.fillTriangle(28, 8, 24, 0, 32, 0)

    enemyGfx.generateTexture('enemy', 44, 44)
    enemyGfx.destroy()

    // Ir a la escena de juego
    this.scene.start('GameScene')
  }
}
