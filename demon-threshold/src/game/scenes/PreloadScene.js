// game/scenes/PreloadScene.js
// Genera todas las texturas placeholder con Graphics de Phaser.
// Sprites pixel art mejorados inspirados en el arte de referencia.

import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  create() {

    // ── JUGADOR — Espadachín encapuchado con espada cian ────────────
    {
      const pg = this.make.graphics({ x: 0, y: 0, add: false })

      // Brillo de espada (capa más trasera)
      pg.fillStyle(0x003344, 0.4)
      pg.fillRect(0, 0, 11, 30)

      // ── Piernas ──
      pg.fillStyle(0x0d0820, 1)
      pg.fillRect(14, 34, 7, 10)
      pg.fillRect(23, 34, 7, 10)
      pg.fillStyle(0x15103a, 1)
      pg.fillRect(15, 34, 3, 10)
      pg.fillRect(24, 34, 3, 10)
      // botas
      pg.fillStyle(0x0a061a, 1)
      pg.fillRect(13, 41, 9, 3)
      pg.fillRect(22, 41, 9, 3)

      // ── Capa/Cuerpo ──
      pg.fillStyle(0x100b22, 1)
      pg.fillRect(10, 18, 24, 18)
      // pliegues tela
      pg.fillStyle(0x181236, 1)
      pg.fillRect(11, 19, 9, 16)
      pg.fillStyle(0x0b091c, 1)
      pg.fillRect(22, 20, 11, 15)
      // borde decorativo capa
      pg.fillStyle(0x241c50, 1)
      pg.fillRect(10, 18, 2, 16)
      pg.fillRect(32, 18, 2, 16)
      pg.fillRect(10, 32, 24, 2)

      // ── Brazos ──
      pg.fillStyle(0x0e0c20, 1)
      pg.fillRect(5, 20, 5, 14)   // brazo izq (sostiene espada)
      pg.fillRect(33, 20, 6, 12)  // brazo der

      // ── Capucha ──
      pg.fillStyle(0x09071a, 1)
      pg.fillRect(11, 5, 22, 14)  // capucha exterior
      pg.fillRect(8, 12, 28, 8)   // ala capucha
      pg.fillStyle(0x05030f, 1)   // sombra interior
      pg.fillRect(13, 6, 18, 10)

      // ── Cara (asomando bajo capucha) ──
      pg.fillStyle(0x38261a, 1)
      pg.fillRect(15, 13, 14, 8)
      pg.fillStyle(0x48321e, 1)
      pg.fillRect(16, 14, 12, 6)
      // nariz/mejilla hint
      pg.fillStyle(0x3a2a1a, 1)
      pg.fillRect(22, 17, 4, 2)

      // ── Ojo brillante (morado) ──
      pg.fillStyle(0x6600dd, 1)
      pg.fillRect(18, 14, 5, 4)
      pg.fillStyle(0xaa55ff, 1)
      pg.fillRect(19, 14, 4, 3)
      pg.fillStyle(0xe6ccff, 1)
      pg.fillRect(20, 14, 2, 2)

      // ══ ESPADA CIAN ══

      // Halo exterior espada
      pg.fillStyle(0x003344, 0.6)
      pg.fillRect(0, 0, 9, 28)

      // Cuerpo hoja
      pg.fillStyle(0x006688, 1)
      pg.fillRect(2, 1, 6, 26)

      // Hoja brillante
      pg.fillStyle(0x00aabb, 1)
      pg.fillRect(3, 0, 5, 27)
      pg.fillStyle(0x00ccee, 1)
      pg.fillRect(4, 0, 4, 26)

      // Filo/reflejo
      pg.fillStyle(0x66ddf5, 1)
      pg.fillRect(5, 0, 2, 24)
      pg.fillStyle(0xbbf2ff, 1)
      pg.fillRect(5, 0, 1, 22)

      // Punta espada (diamante)
      pg.fillStyle(0x00bbdd, 1)
      pg.fillRect(2, 0, 6, 2)
      pg.fillStyle(0x88e8ff, 1)
      pg.fillRect(3, 0, 4, 1)
      pg.fillStyle(0xffffff, 0.9)
      pg.fillRect(5, 0, 1, 1)

      // Guarda cruzada
      pg.fillStyle(0x1e2d3d, 1)
      pg.fillRect(0, 26, 12, 5)
      pg.fillStyle(0x2c4458, 1)
      pg.fillRect(0, 26, 12, 2)
      // Cristal de la guarda
      pg.fillStyle(0x00eeff, 1)
      pg.fillRect(4, 26, 4, 5)
      pg.fillStyle(0xffffff, 0.9)
      pg.fillRect(5, 27, 2, 2)

      // Empuñadura
      pg.fillStyle(0x281808, 1)
      pg.fillRect(4, 31, 4, 9)
      pg.fillStyle(0x3a2210, 1)
      pg.fillRect(5, 31, 2, 9)
      // enrollado
      pg.fillStyle(0x180e06, 1)
      pg.fillRect(4, 33, 4, 1)
      pg.fillRect(4, 36, 4, 1)
      pg.fillRect(4, 39, 4, 1)

      pg.generateTexture('player', 44, 44)
      pg.destroy()
    }


    // ── SUELO (sin cambios) ──────────────────────────────────────────
    {
      const fg = this.make.graphics({ x: 0, y: 0, add: false })
      fg.fillStyle(0x13131c, 1); fg.fillRect(0, 0, 50, 50)
      fg.lineStyle(1, 0x1e1e30, 0.5); fg.strokeRect(0, 0, 50, 50)
      fg.fillStyle(0x0f0f1a, 0.3); fg.fillRect(2, 2, 20, 20)
      fg.generateTexture('floor', 50, 50); fg.destroy()
    }

    // ── PARED (sin cambios) ─────────────────────────────────────────
    {
      const wg = this.make.graphics({ x: 0, y: 0, add: false })
      wg.fillStyle(0x1a1a28, 1); wg.fillRect(0, 0, 50, 50)
      wg.lineStyle(1, 0x2a2a40, 0.8); wg.strokeRect(1, 1, 48, 48)
      wg.fillStyle(0x222235, 1); wg.fillRect(4, 4, 42, 20); wg.fillRect(4, 28, 42, 18)
      wg.generateTexture('wall', 50, 50); wg.destroy()
    }

    // ── ENEMIGO MELEE — Demonio rojo grande con cuernos ─────────────
    {
      const eg = this.make.graphics({ x: 0, y: 0, add: false })

      // Sombra base
      eg.fillStyle(0x0e0000, 1)
      eg.fillRect(5, 10, 34, 34)

      // ── Piernas ──
      eg.fillStyle(0x2a0800, 1)
      eg.fillRect(9, 32, 12, 12)
      eg.fillRect(23, 32, 12, 12)
      eg.fillStyle(0x3e0e00, 1)
      eg.fillRect(10, 32, 7, 12)
      eg.fillRect(24, 32, 7, 12)
      // pezuñas
      eg.fillStyle(0x1a0400, 1)
      eg.fillRect(8, 41, 14, 3)
      eg.fillRect(22, 41, 14, 3)

      // ── Torso ──
      eg.fillStyle(0x481208, 1)
      eg.fillRect(7, 12, 30, 22)
      // músculo pectoral izquierdo
      eg.fillStyle(0x6a1c0c, 1)
      eg.fillRect(8, 13, 13, 16)
      // sombra pectoral derecho
      eg.fillStyle(0x380a04, 1)
      eg.fillRect(23, 14, 12, 16)
      // centro pecho
      eg.fillStyle(0x5a1810, 1)
      eg.fillRect(17, 12, 10, 22)
      // abdomen
      eg.fillStyle(0x2e0a04, 1)
      eg.fillRect(16, 22, 12, 10)
      eg.fillStyle(0x3a0c06, 1)
      eg.fillRect(18, 24, 8, 6)
      // líneas de músculo
      eg.fillStyle(0x1e0600, 1)
      eg.fillRect(21, 13, 1, 18)

      // ── Brazos ──
      eg.fillStyle(0x481208, 1)
      eg.fillRect(0, 13, 9, 20)
      eg.fillRect(35, 13, 9, 18)
      // músculo bíceps
      eg.fillStyle(0x6a1c0c, 1)
      eg.fillRect(0, 13, 6, 12)
      eg.fillRect(35, 13, 6, 12)
      // antebrazo oscuro
      eg.fillStyle(0x380a04, 1)
      eg.fillRect(1, 25, 7, 8)
      eg.fillRect(36, 25, 7, 6)

      // Puños/manos
      eg.fillStyle(0x3a0c04, 1)
      eg.fillRect(0, 31, 9, 7)
      eg.fillRect(35, 29, 9, 7)
      eg.fillStyle(0x4e1208, 1)
      eg.fillRect(1, 31, 5, 7)
      eg.fillRect(36, 29, 5, 7)
      // nudillos
      eg.fillStyle(0x280600, 1)
      eg.fillRect(0, 31, 9, 2)
      eg.fillRect(35, 29, 9, 2)

      // ── Cuello ──
      eg.fillStyle(0x481208, 1)
      eg.fillRect(16, 8, 12, 6)
      eg.fillStyle(0x5a1810, 1)
      eg.fillRect(17, 8, 8, 6)

      // ── Cabeza ──
      eg.fillStyle(0x5a1810, 1)
      eg.fillRect(9, 1, 26, 14)
      eg.fillStyle(0x481208, 1)
      eg.fillRect(9, 1, 8, 14)
      eg.fillStyle(0x6e2014, 1)  // highlight derecho
      eg.fillRect(22, 2, 10, 10)
      // frente
      eg.fillStyle(0x5e1c12, 1)
      eg.fillRect(14, 1, 16, 5)

      // ── Cuernos ──
      // cuerno izquierdo
      eg.fillStyle(0x160400, 1)
      eg.fillRect(7, 0, 6, 3)
      eg.fillRect(9, 0, 4, 9)
      eg.fillStyle(0x2c1000, 1)  // borde interior
      eg.fillRect(9, 1, 3, 8)
      eg.fillStyle(0x1a0800, 1)  // punta
      eg.fillRect(10, 0, 2, 2)
      // cuerno derecho
      eg.fillStyle(0x160400, 1)
      eg.fillRect(31, 0, 6, 3)
      eg.fillRect(31, 0, 4, 9)
      eg.fillStyle(0x2c1000, 1)
      eg.fillRect(32, 1, 3, 8)
      eg.fillStyle(0x1a0800, 1)
      eg.fillRect(32, 0, 2, 2)

      // ── Cuencas de ojos ──
      eg.fillStyle(0x0d0100, 1)
      eg.fillRect(11, 5, 10, 6)
      eg.fillRect(23, 5, 10, 6)

      // ── Ojos (naranja ardiente) ──
      eg.fillStyle(0xff3300, 1)
      eg.fillRect(12, 6, 8, 4)
      eg.fillRect(24, 6, 8, 4)
      eg.fillStyle(0xff6600, 1)
      eg.fillRect(12, 6, 8, 2)
      eg.fillRect(24, 6, 8, 2)
      eg.fillStyle(0xffaa00, 1)
      eg.fillRect(13, 6, 6, 2)
      eg.fillRect(25, 6, 6, 2)
      // pupila brillante
      eg.fillStyle(0xffee44, 1)
      eg.fillRect(14, 6, 3, 1)
      eg.fillRect(26, 6, 3, 1)

      // ── Boca con dientes ──
      eg.fillStyle(0x070000, 1)
      eg.fillRect(13, 12, 18, 5)
      // dientes
      eg.fillStyle(0xe8e8d8, 1)
      eg.fillRect(14, 12, 3, 3)
      eg.fillRect(19, 12, 3, 3)
      eg.fillRect(24, 12, 3, 3)
      eg.fillRect(29, 12, 2, 3)
      // encía
      eg.fillStyle(0x700010, 1)
      eg.fillRect(14, 14, 17, 2)

      eg.generateTexture('enemy', 44, 44)
      eg.destroy()
    }

    // ── ARQUERO — Demonio verde con arco ────────────────────────────
    {
      const ag = this.make.graphics({ x: 0, y: 0, add: false })

      // Sombra base (verde)
      ag.fillStyle(0x000e02, 1)
      ag.fillRect(5, 10, 34, 34)

      // ── Piernas ──
      ag.fillStyle(0x002a08, 1)
      ag.fillRect(9, 32, 12, 12)
      ag.fillRect(23, 32, 12, 12)
      ag.fillStyle(0x003e10, 1)
      ag.fillRect(10, 32, 7, 12)
      ag.fillRect(24, 32, 7, 12)
      ag.fillStyle(0x001a04, 1)
      ag.fillRect(8, 41, 14, 3)
      ag.fillRect(22, 41, 14, 3)

      // ── Torso ──
      ag.fillStyle(0x084812, 1)
      ag.fillRect(7, 12, 30, 22)
      ag.fillStyle(0x0c6a1c, 1)
      ag.fillRect(8, 13, 13, 16)
      ag.fillStyle(0x043808, 1)
      ag.fillRect(23, 14, 12, 16)
      ag.fillStyle(0x0a5818, 1)
      ag.fillRect(17, 12, 10, 22)
      ag.fillStyle(0x042e08, 1)
      ag.fillRect(16, 22, 12, 10)
      ag.fillStyle(0x063a0a, 1)
      ag.fillRect(18, 24, 8, 6)
      ag.fillStyle(0x001e04, 1)
      ag.fillRect(21, 13, 1, 18)

      // ── Brazos ──
      ag.fillStyle(0x084812, 1)
      ag.fillRect(0, 13, 9, 20)
      ag.fillRect(35, 13, 9, 18)
      ag.fillStyle(0x0c6a1c, 1)
      ag.fillRect(0, 13, 6, 12)
      ag.fillRect(35, 13, 6, 12)
      ag.fillStyle(0x043808, 1)
      ag.fillRect(1, 25, 7, 8)
      ag.fillRect(36, 25, 7, 6)

      // Manos
      ag.fillStyle(0x063a0c, 1)
      ag.fillRect(0, 31, 9, 7)
      ag.fillRect(35, 29, 9, 7)
      ag.fillStyle(0x0a4e12, 1)
      ag.fillRect(1, 31, 5, 7)
      ag.fillRect(36, 29, 5, 7)
      ag.fillStyle(0x002808, 1)
      ag.fillRect(0, 31, 9, 2)
      ag.fillRect(35, 29, 9, 2)

      // ── Cuello ──
      ag.fillStyle(0x084812, 1)
      ag.fillRect(16, 8, 12, 6)
      ag.fillStyle(0x0a5818, 1)
      ag.fillRect(17, 8, 8, 6)

      // ── Cabeza ──
      ag.fillStyle(0x105818, 1)
      ag.fillRect(9, 1, 26, 14)
      ag.fillStyle(0x084812, 1)
      ag.fillRect(9, 1, 8, 14)
      ag.fillStyle(0x146e20, 1)
      ag.fillRect(22, 2, 10, 10)
      ag.fillStyle(0x0e5e1a, 1)
      ag.fillRect(14, 1, 16, 5)

      // ── Cuernos (verde oscuro) ──
      ag.fillStyle(0x001600, 1)
      ag.fillRect(7, 0, 6, 3)
      ag.fillRect(9, 0, 4, 9)
      ag.fillStyle(0x002c10, 1)
      ag.fillRect(9, 1, 3, 8)
      ag.fillStyle(0x001a08, 1)
      ag.fillRect(10, 0, 2, 2)
      ag.fillStyle(0x001600, 1)
      ag.fillRect(31, 0, 6, 3)
      ag.fillRect(31, 0, 4, 9)
      ag.fillStyle(0x002c10, 1)
      ag.fillRect(32, 1, 3, 8)
      ag.fillStyle(0x001a08, 1)
      ag.fillRect(32, 0, 2, 2)

      // ── Cuencas ──
      ag.fillStyle(0x000d01, 1)
      ag.fillRect(11, 5, 10, 6)
      ag.fillRect(23, 5, 10, 6)

      // ── Ojos (verde brillante) ──
      ag.fillStyle(0x00bb33, 1)
      ag.fillRect(12, 6, 8, 4)
      ag.fillRect(24, 6, 8, 4)
      ag.fillStyle(0x00dd55, 1)
      ag.fillRect(12, 6, 8, 2)
      ag.fillRect(24, 6, 8, 2)
      ag.fillStyle(0x00ff77, 1)
      ag.fillRect(13, 6, 6, 2)
      ag.fillRect(25, 6, 6, 2)
      ag.fillStyle(0xaaffcc, 1)
      ag.fillRect(14, 6, 3, 1)
      ag.fillRect(26, 6, 3, 1)

      // ── Boca ──
      ag.fillStyle(0x000700, 1)
      ag.fillRect(13, 12, 18, 5)
      ag.fillStyle(0xe8e8d8, 1)
      ag.fillRect(14, 12, 3, 3)
      ag.fillRect(19, 12, 3, 3)
      ag.fillRect(24, 12, 3, 3)
      ag.fillRect(29, 12, 2, 3)
      ag.fillStyle(0x007010, 1)
      ag.fillRect(14, 14, 17, 2)

      // ══ ARCO (sostenido al lado derecho) ══

      // Madera del arco (curvada)
      ag.fillStyle(0x5c3a00, 1)
      // rama superior
      ag.fillRect(37, 4, 5, 3)
      ag.fillRect(39, 7, 4, 4)
      ag.fillRect(40, 11, 3, 4)
      ag.fillRect(40, 15, 3, 5)
      // rama inferior
      ag.fillRect(40, 20, 3, 5)
      ag.fillRect(40, 25, 3, 4)
      ag.fillRect(39, 29, 4, 4)
      ag.fillRect(37, 33, 5, 3)
      // empuñadura del arco
      ag.fillStyle(0x3a2000, 1)
      ag.fillRect(40, 17, 3, 6)
      // resaltes madera
      ag.fillStyle(0x7a5010, 1)
      ag.fillRect(38, 5, 2, 2)
      ag.fillRect(41, 8, 1, 3)
      ag.fillRect(41, 30, 1, 3)
      ag.fillRect(38, 33, 2, 2)

      // Cuerda del arco
      ag.lineStyle(1, 0xddddaa, 1)
      ag.beginPath()
      ag.moveTo(41, 6)
      ag.lineTo(43, 21)
      ag.lineTo(41, 35)
      ag.strokePath()

      // Flecha encajada
      ag.fillStyle(0x6a3000, 1)  // astil
      ag.fillRect(14, 20, 28, 2)
      // punta de flecha
      ag.fillStyle(0xccaa33, 1)
      ag.fillRect(39, 18, 5, 6)
      ag.fillStyle(0xeecc44, 1)
      ag.fillRect(40, 19, 4, 4)
      // plumas (flechado)
      ag.fillStyle(0xddddcc, 1)
      ag.fillRect(14, 18, 5, 2)
      ag.fillRect(14, 22, 5, 2)
      ag.fillStyle(0xffffff, 0.7)
      ag.fillRect(15, 18, 3, 2)
      ag.fillRect(15, 22, 3, 2)

      ag.generateTexture('archer', 44, 44)
      ag.destroy()
    }

    // ── FLECHA (sin cambios) ─────────────────────────────────────────
    {
      const arrowG = this.make.graphics({ x: 0, y: 0, add: false })
      arrowG.fillStyle(0xaa8833, 1)
      arrowG.fillRect(0, 3, 14, 2)
      arrowG.fillStyle(0xddcc55, 1)
      arrowG.fillTriangle(14, 0, 14, 8, 20, 4)
      arrowG.fillStyle(0xffffff, 0.8)
      arrowG.fillTriangle(0, 0, 4, 4, 0, 4)
      arrowG.fillTriangle(0, 8, 4, 4, 0, 4)
      arrowG.generateTexture('arrow', 20, 8)
      arrowG.destroy()
    }

    // ── BOSS (sin cambios) ───────────────────────────────────────────
    {
      const bg = this.make.graphics({ x: 0, y: 0, add: false })
      bg.fillStyle(0x550000, 0.4); bg.fillCircle(36, 36, 34)
      bg.fillStyle(0xaa0000, 1);   bg.fillCircle(36, 36, 26)
      bg.fillStyle(0xff2200, 1);   bg.fillCircle(28, 28, 14)
      bg.fillStyle(0xffffff, 1);   bg.fillCircle(26, 26, 5)
      bg.fillStyle(0x000000, 1);   bg.fillCircle(28, 28, 3)
      bg.fillStyle(0xffaa00, 1)
      bg.fillTriangle(20, 12,  8,  0, 28, 10)
      bg.fillTriangle(52, 12, 64,  0, 44, 10)
      bg.lineStyle(3, 0xffcc00, 1)
      bg.beginPath()
      bg.moveTo(16, 18); bg.lineTo(22, 8); bg.lineTo(28, 18)
      bg.lineTo(36, 6);  bg.lineTo(44, 18); bg.lineTo(50, 8); bg.lineTo(56, 18)
      bg.strokePath()
      bg.generateTexture('boss', 72, 72)
      bg.destroy()
    }

    this.scene.start('GameScene')
  }
}