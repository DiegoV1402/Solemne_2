// game/scenes/PreloadScene.js
// Genera todas las texturas placeholder con Graphics de Phaser.

import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  create() {
    // ── JUGADOR (círculo púrpura) ─────────────────────────
    const pg = this.make.graphics({ x: 0, y: 0, add: false })
    pg.fillStyle(0x5500cc, 0.35); pg.fillCircle(22, 22, 20)
    pg.fillStyle(0x7b2fff, 1);    pg.fillCircle(22, 22, 15)
    pg.fillStyle(0xaa77ff, 1);    pg.fillCircle(17, 16, 6)
    pg.fillStyle(0xffffff, 1);    pg.fillCircle(16, 15, 3)
    pg.generateTexture('player', 44, 44); pg.destroy()

    // ── SUELO ─────────────────────────────────────────────
    const fg = this.make.graphics({ x: 0, y: 0, add: false })
    fg.fillStyle(0x13131c, 1); fg.fillRect(0, 0, 50, 50)
    fg.lineStyle(1, 0x1e1e30, 0.5); fg.strokeRect(0, 0, 50, 50)
    fg.fillStyle(0x0f0f1a, 0.3); fg.fillRect(2, 2, 20, 20)
    fg.generateTexture('floor', 50, 50); fg.destroy()

    // ── PARED ─────────────────────────────────────────────
    const wg = this.make.graphics({ x: 0, y: 0, add: false })
    wg.fillStyle(0x1a1a28, 1); wg.fillRect(0, 0, 50, 50)
    wg.lineStyle(1, 0x2a2a40, 0.8); wg.strokeRect(1, 1, 48, 48)
    wg.fillStyle(0x222235, 1); wg.fillRect(4, 4, 42, 20); wg.fillRect(4, 28, 42, 18)
    wg.generateTexture('wall', 50, 50); wg.destroy()

    // ── ENEMIGO MELEE (rojo con cuernos) ──────────────────
    const eg = this.make.graphics({ x: 0, y: 0, add: false })
    eg.fillStyle(0x880000, 0.35); eg.fillCircle(22, 22, 20)
    eg.fillStyle(0xcc1111, 1);    eg.fillCircle(22, 22, 14)
    eg.fillStyle(0xff3333, 1);    eg.fillCircle(17, 16, 7)
    eg.fillStyle(0xffffff, 1);    eg.fillCircle(16, 15, 3)
    eg.fillStyle(0x000000, 1);    eg.fillCircle(17, 16, 1.5)
    eg.fillStyle(0x880000, 1)
    eg.fillTriangle(16, 8, 12, 0, 20, 0)
    eg.fillTriangle(28, 8, 24, 0, 32, 0)
    eg.generateTexture('enemy', 44, 44); eg.destroy()

    // ── ARQUERO (azul oscuro con capucha) ─────────────────
    const ag = this.make.graphics({ x: 0, y: 0, add: false })
    ag.fillStyle(0x001144, 0.35); ag.fillCircle(22, 22, 20)
    ag.fillStyle(0x1a3a88, 1);    ag.fillCircle(22, 22, 14)
    ag.fillStyle(0x44aaff, 1);    ag.fillCircle(17, 16, 7)
    ag.fillStyle(0xffffff, 1);    ag.fillCircle(16, 15, 3)
    ag.fillStyle(0x000000, 1);    ag.fillCircle(17, 16, 1.5)
    // Capucha (arco en la parte superior)
    ag.lineStyle(3, 0x88ccff, 1)
    ag.beginPath()
    ag.arc(22, 22, 18, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340), false)
    ag.strokePath()
    ag.generateTexture('archer', 44, 44); ag.destroy()

    // ── FLECHA ────────────────────────────────────────────
    const arrowG = this.make.graphics({ x: 0, y: 0, add: false })
    // Cuerpo de la flecha
    arrowG.fillStyle(0xaa8833, 1)
    arrowG.fillRect(0, 3, 14, 2)
    // Punta
    arrowG.fillStyle(0xddcc55, 1)
    arrowG.fillTriangle(14, 0, 14, 8, 20, 4)
    // Plumas
    arrowG.fillStyle(0xffffff, 0.8)
    arrowG.fillTriangle(0, 0, 4, 4, 0, 4)
    arrowG.fillTriangle(0, 8, 4, 4, 0, 4)
    arrowG.generateTexture('arrow', 20, 8); arrowG.destroy()

    this.scene.start('GameScene')
  }
}
