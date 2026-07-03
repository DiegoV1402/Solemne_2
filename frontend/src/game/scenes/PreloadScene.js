// game/scenes/PreloadScene.js
// Genera todas las texturas placeholder con Graphics de Phaser.
// Sprites pixel art mejorados inspirados en el arte de referencia.

import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  create() {

    // ── JUGADOR — Caballero con armadura metálica, casco y escudo ───
    {
      const pg = this.make.graphics({ x: 0, y: 0, add: false })

      // Sombra
      pg.fillStyle(0x000000, 0.28)
      pg.fillEllipse(22, 43, 18, 5)

      // ── BOTAS / PIERNAS ──
      pg.fillStyle(0x2a2d38, 1)        // metal oscuro
      pg.fillRect(14, 34, 7, 9)
      pg.fillRect(23, 34, 7, 9)
      pg.fillStyle(0x3d4255, 1)        // reflejo
      pg.fillRect(15, 34, 3, 8)
      pg.fillRect(24, 34, 3, 8)
      pg.fillStyle(0x1a1c26, 1)        // suela
      pg.fillRect(13, 41, 9, 2)
      pg.fillRect(22, 41, 9, 2)
      // rodilleras
      pg.fillStyle(0x5a6070, 1)
      pg.fillRect(14, 33, 7, 3)
      pg.fillRect(23, 33, 7, 3)
      pg.fillStyle(0x8090a8, 1)
      pg.fillRect(15, 33, 5, 1)
      pg.fillRect(24, 33, 5, 1)

      // ── CUERPO / PETO DE ARMADURA ──
      pg.fillStyle(0x2e3240, 1)        // base peto oscuro
      pg.fillRect(11, 19, 22, 16)
      pg.fillStyle(0x424a5e, 1)        // placa izquierda
      pg.fillRect(12, 20, 9, 14)
      pg.fillStyle(0x4e5870, 1)        // placa derecha con más luz
      pg.fillRect(21, 20, 10, 14)
      pg.fillStyle(0x6878a0, 1)        // reflejo diagonal
      pg.fillRect(22, 20, 6, 8)
      pg.fillStyle(0x1e2230, 1)        // bordes del peto
      pg.fillRect(11, 19, 2, 16)
      pg.fillRect(31, 19, 2, 16)
      pg.fillRect(11, 33, 22, 2)
      // línea central del peto
      pg.fillStyle(0x1e2230, 1)
      pg.fillRect(21, 20, 2, 13)
      // detalle dorado central (emblema)
      pg.fillStyle(0xc8a030, 1)
      pg.fillRect(19, 23, 6, 1)
      pg.fillRect(21, 21, 2, 5)
      pg.fillStyle(0xf0c040, 1)
      pg.fillRect(20, 22, 4, 1)
      pg.fillRect(21, 21, 2, 1)

      // ── FALDÓN DE ARMADURA ──
      pg.fillStyle(0x353848, 1)
      pg.fillRect(12, 33, 20, 4)
      pg.fillStyle(0x424a5e, 1)
      pg.fillRect(13, 33, 6, 3)
      pg.fillRect(21, 33, 6, 3)
      pg.fillStyle(0x1e2230, 1)
      pg.fillRect(19, 33, 2, 4)

      // ── HOMBRERAS ──
      // hombrera izquierda
      pg.fillStyle(0x2e3240, 1)
      pg.fillRect(6, 17, 8, 7)
      pg.fillStyle(0x5a6480, 1)
      pg.fillRect(7, 17, 6, 5)
      pg.fillStyle(0x7888a8, 1)
      pg.fillRect(8, 17, 4, 3)
      pg.fillStyle(0x1e2230, 1)
      pg.fillRect(6, 17, 1, 7)
      pg.fillRect(6, 23, 8, 1)
      // hombrera derecha
      pg.fillStyle(0x2e3240, 1)
      pg.fillRect(30, 17, 8, 7)
      pg.fillStyle(0x5a6480, 1)
      pg.fillRect(31, 17, 6, 5)
      pg.fillStyle(0x7888a8, 1)
      pg.fillRect(32, 17, 4, 3)
      pg.fillStyle(0x1e2230, 1)
      pg.fillRect(37, 17, 1, 7)
      pg.fillRect(30, 23, 8, 1)

      // ── BRAZOS / GUANTELETES ──
      pg.fillStyle(0x2e3240, 1)
      pg.fillRect(7, 24, 6, 10)
      pg.fillRect(31, 24, 6, 9)
      pg.fillStyle(0x424a5e, 1)
      pg.fillRect(8, 24, 3, 9)
      pg.fillRect(32, 24, 3, 8)
      // guanteletes
      pg.fillStyle(0x353848, 1)
      pg.fillRect(7, 32, 6, 4)
      pg.fillRect(31, 31, 6, 4)
      pg.fillStyle(0x5a6480, 1)
      pg.fillRect(8, 32, 4, 2)
      pg.fillRect(32, 31, 4, 2)

      // ── ESCUDO (brazo izquierdo) ──
      pg.fillStyle(0x1e2230, 1)        // borde escudo
      pg.fillRect(0, 22, 10, 14)
      pg.fillStyle(0x2e3240, 1)        // cuerpo escudo
      pg.fillRect(1, 23, 8, 12)
      pg.fillStyle(0x424a5e, 1)        // reflejo escudo
      pg.fillRect(2, 24, 5, 9)
      pg.fillStyle(0x5a6480, 1)
      pg.fillRect(3, 25, 3, 6)
      // emblema dorado del escudo
      pg.fillStyle(0xc8a030, 1)
      pg.fillRect(3, 27, 4, 4)
      pg.fillRect(4, 26, 2, 6)
      pg.fillStyle(0xf0c040, 1)
      pg.fillRect(4, 27, 2, 4)
      pg.fillRect(3, 28, 4, 2)
      pg.fillStyle(0xffe060, 1)
      pg.fillRect(4, 28, 2, 2)
      // borde inferior redondeado del escudo
      pg.fillStyle(0x1e2230, 1)
      pg.fillRect(2, 35, 6, 1)
      pg.fillRect(3, 36, 4, 1)

      // ── CASCO ──
      // base del casco — azul acero
      pg.fillStyle(0x1e2230, 1)        // borde exterior
      pg.fillRect(11, 4, 22, 16)
      pg.fillStyle(0x2e3240, 1)        // cuerpo casco
      pg.fillRect(12, 5, 20, 14)
      pg.fillStyle(0x424a5e, 1)        // lado izquierdo
      pg.fillRect(13, 6, 8, 12)
      pg.fillStyle(0x5a6890, 1)        // lado derecho más iluminado
      pg.fillRect(21, 6, 9, 11)
      pg.fillStyle(0x7090b8, 1)        // reflejo brillante
      pg.fillRect(23, 6, 5, 6)
      pg.fillStyle(0x90b0d0, 1)        // punto de luz máximo
      pg.fillRect(25, 6, 2, 3)
      // penacho azul del casco
      pg.fillStyle(0x1844a0, 1)
      pg.fillRect(17, 2, 4, 5)
      pg.fillRect(15, 3, 8, 3)
      pg.fillStyle(0x2255cc, 1)
      pg.fillRect(18, 1, 2, 5)
      pg.fillRect(16, 3, 6, 2)
      pg.fillStyle(0x4488ff, 1)
      pg.fillRect(19, 1, 1, 4)
      // visera del casco (ranura oscura para los ojos)
      pg.fillStyle(0x0a0c12, 1)
      pg.fillRect(13, 13, 18, 4)
      pg.fillStyle(0x0d0f18, 1)
      pg.fillRect(14, 14, 16, 3)
      // ojos brillantes en la visera — amarillo/dorado
      pg.fillStyle(0xd4a020, 1)
      pg.fillRect(15, 14, 5, 2)
      pg.fillRect(24, 14, 5, 2)
      pg.fillStyle(0xffe060, 1)
      pg.fillRect(16, 14, 3, 1)
      pg.fillRect(25, 14, 3, 1)
      // barbote / parte inferior del casco
      pg.fillStyle(0x2e3240, 1)
      pg.fillRect(13, 17, 18, 4)
      pg.fillStyle(0x424a5e, 1)
      pg.fillRect(14, 17, 8, 3)
      pg.fillStyle(0x4e5870, 1)
      pg.fillRect(22, 17, 7, 3)
      // ranuras del barbote
      pg.fillStyle(0x1e2230, 1)
      pg.fillRect(15, 18, 14, 1)
      pg.fillRect(15, 20, 14, 1)
      // borde inferior del casco
      pg.fillStyle(0x1e2230, 1)
      pg.fillRect(11, 19, 22, 1)

      pg.generateTexture('player', 44, 44)
      pg.destroy()
    }

    // ── JUGADOR (MAGO) — Túnica arcana con capucha y bastón rúnico ──
    {
      const mg = this.make.graphics({ x: 0, y: 0, add: false })

      // Sombra
      mg.fillStyle(0x000000, 0.28)
      mg.fillEllipse(22, 43, 18, 5)

      // ── BOTAS (asoman bajo la túnica) ──
      mg.fillStyle(0x241830, 1)
      mg.fillRect(15, 37, 6, 6)
      mg.fillRect(23, 37, 6, 6)
      mg.fillStyle(0x1a1022, 1)
      mg.fillRect(14, 41, 8, 2)
      mg.fillRect(22, 41, 8, 2)

      // ── FALDÓN DE TÚNICA (forma acampanada) ──
      mg.fillStyle(0x2c1a4a, 1)
      mg.fillRect(9, 28, 26, 11)
      mg.fillStyle(0x3a2264, 1)
      mg.fillRect(10, 29, 11, 9)
      mg.fillStyle(0x241640, 1)
      mg.fillRect(23, 29, 11, 9)
      // bordes dorados del faldón (eco del emblema del guerrero)
      mg.fillStyle(0xc8a030, 1)
      mg.fillRect(9, 37, 26, 2)
      mg.fillStyle(0xf0c040, 1)
      mg.fillRect(9, 37, 26, 1)

      // ── TÚNICA / TORSO ──
      mg.fillStyle(0x36205e, 1)
      mg.fillRect(12, 18, 20, 12)
      mg.fillStyle(0x452a78, 1)
      mg.fillRect(13, 19, 9, 10)
      mg.fillStyle(0x2a1850, 1)
      mg.fillRect(22, 19, 9, 10)
      // cinturón con hebilla dorada
      mg.fillStyle(0x1a1030, 1)
      mg.fillRect(12, 27, 20, 3)
      mg.fillStyle(0xc8a030, 1)
      mg.fillRect(19, 27, 6, 3)
      mg.fillStyle(0xf0c040, 1)
      mg.fillRect(20, 28, 4, 1)
      // runas bordadas centrales (arcano cian)
      mg.fillStyle(0x66ccff, 1)
      mg.fillRect(20, 20, 2, 6)
      mg.fillRect(19, 22, 4, 1)

      // ── HOMBRERAS DE LA TÚNICA ──
      mg.fillStyle(0x2c1a4a, 1)
      mg.fillRect(6, 17, 8, 7)
      mg.fillRect(30, 17, 8, 7)
      mg.fillStyle(0x452a78, 1)
      mg.fillRect(7, 17, 6, 5)
      mg.fillRect(31, 17, 6, 5)
      mg.fillStyle(0x1a1030, 1)
      mg.fillRect(6, 17, 1, 7)
      mg.fillRect(37, 17, 1, 7)

      // ── BRAZOS / MANGAS ──
      mg.fillStyle(0x2c1a4a, 1)
      mg.fillRect(7, 24, 6, 10)
      mg.fillRect(31, 22, 6, 12)
      mg.fillStyle(0x3a2264, 1)
      mg.fillRect(8, 24, 3, 9)
      mg.fillRect(32, 22, 3, 11)
      // manos
      mg.fillStyle(0xd4b088, 1)
      mg.fillRect(7, 32, 6, 4)
      mg.fillRect(30, 30, 7, 5)

      // ── ORBE FLOTANTE (mano izquierda) — eco del escudo del guerrero ──
      mg.fillStyle(0x1a1030, 0.5)
      mg.fillCircle(10, 34, 6)
      mg.fillStyle(0x3355cc, 0.9)
      mg.fillCircle(10, 34, 5)
      mg.fillStyle(0x66aaff, 1)
      mg.fillCircle(10, 34, 3)
      mg.fillStyle(0xccf0ff, 1)
      mg.fillCircle(9, 33, 1.5)

      // ── BASTÓN (mano derecha, se extiende hacia arriba) ──
      mg.fillStyle(0x4a3018, 1)
      mg.fillRect(35, 8, 3, 26)
      mg.fillStyle(0x6a4820, 1)
      mg.fillRect(35, 8, 1, 26)
      // orbe rúnico en la punta del bastón
      mg.fillStyle(0x1a1030, 0.6)
      mg.fillCircle(36, 6, 8)
      mg.fillStyle(0x5533cc, 0.9)
      mg.fillCircle(36, 6, 6)
      mg.fillStyle(0x8866ff, 1)
      mg.fillCircle(36, 6, 4)
      mg.fillStyle(0xe0ccff, 1)
      mg.fillCircle(35, 5, 1.5)

      // ── CAPUCHA (cabeza) ──
      mg.fillStyle(0x1a1030, 1)
      mg.fillRect(11, 3, 22, 16)
      mg.fillStyle(0x2c1a4a, 1)
      mg.fillRect(12, 4, 20, 14)
      mg.fillStyle(0x36205e, 1)
      mg.fillRect(13, 5, 8, 12)
      mg.fillStyle(0x1e1238, 1)
      mg.fillRect(21, 5, 9, 11)
      // punta de la capucha
      mg.fillStyle(0x1a1030, 1)
      mg.fillRect(18, 0, 6, 4)
      mg.fillStyle(0x2c1a4a, 1)
      mg.fillRect(19, 1, 4, 3)
      // sombra del rostro bajo la capucha
      mg.fillStyle(0x0a0512, 1)
      mg.fillRect(14, 12, 16, 6)
      // ojos brillantes (arcano cian) — equivalente a la visera dorada del guerrero
      mg.fillStyle(0x44ddff, 1)
      mg.fillRect(16, 13, 5, 3)
      mg.fillRect(24, 13, 5, 3)
      mg.fillStyle(0xaaf4ff, 1)
      mg.fillRect(17, 13, 3, 1)
      mg.fillRect(25, 13, 3, 1)

      mg.generateTexture('player-mage', 44, 44)
      mg.destroy()
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

    // ── MAGO ENEMIGO — Hechicero corrupto con túnica violeta ─────────
    {
      const mge = this.make.graphics({ x: 0, y: 0, add: false })

      // Sombra base
      mge.fillStyle(0x0a0014, 1)
      mge.fillRect(5, 10, 34, 34)

      // ── Faldón de túnica (acampanado) ──
      mge.fillStyle(0x2a1040, 1)
      mge.fillRect(7, 26, 30, 18)
      mge.fillStyle(0x3c1858, 1)
      mge.fillRect(8, 27, 13, 16)
      mge.fillStyle(0x200c30, 1)
      mge.fillRect(23, 27, 13, 16)
      // ribete arcano inferior
      mge.fillStyle(0x9944ee, 1)
      mge.fillRect(7, 41, 30, 2)
      mge.fillStyle(0xcc88ff, 1)
      mge.fillRect(7, 41, 30, 1)

      // ── Torso / túnica ──
      mge.fillStyle(0x351450, 1)
      mge.fillRect(9, 13, 26, 15)
      mge.fillStyle(0x461c68, 1)
      mge.fillRect(10, 14, 12, 13)
      mge.fillStyle(0x260e3c, 1)
      mge.fillRect(22, 14, 12, 13)
      // runas en el pecho
      mge.fillStyle(0xbb66ff, 1)
      mge.fillRect(20, 16, 2, 8)
      mge.fillRect(18, 19, 6, 2)
      mge.fillStyle(0xeebbff, 1)
      mge.fillRect(20, 16, 2, 3)

      // ── Mangas / brazos ──
      mge.fillStyle(0x2a1040, 1)
      mge.fillRect(2, 15, 8, 16)
      mge.fillRect(34, 15, 8, 16)
      mge.fillStyle(0x461c68, 1)
      mge.fillRect(3, 15, 5, 12)
      mge.fillRect(35, 15, 5, 12)
      // manos
      mge.fillStyle(0x8858a0, 1)
      mge.fillRect(2, 27, 6, 5)
      mge.fillRect(36, 27, 6, 5)

      // ── Capucha / cabeza ──
      mge.fillStyle(0x200c30, 1)
      mge.fillRect(10, 2, 24, 15)
      mge.fillStyle(0x351450, 1)
      mge.fillRect(11, 3, 22, 12)
      mge.fillStyle(0x461c68, 1)
      mge.fillRect(12, 4, 10, 9)
      // sombra bajo la capucha (rostro oculto)
      mge.fillStyle(0x05000a, 1)
      mge.fillRect(14, 8, 16, 8)

      // ── Ojos brillantes (violeta) ──
      mge.fillStyle(0xaa55ff, 1)
      mge.fillRect(16, 10, 5, 3)
      mge.fillRect(24, 10, 5, 3)
      mge.fillStyle(0xeeccff, 1)
      mge.fillRect(17, 10, 2, 2)
      mge.fillRect(25, 10, 2, 2)

      // ── Punta de capucha ──
      mge.fillStyle(0x200c30, 1)
      mge.fillRect(19, -2, 6, 6)
      mge.fillStyle(0x9944ee, 1)
      mge.fillRect(21, -2, 2, 4)

      // ── Orbe arcano flotante (mano derecha) ──
      mge.fillStyle(0x5522aa, 0.5)
      mge.fillCircle(40, 20, 7)
      mge.fillStyle(0x9955ee, 0.9)
      mge.fillCircle(40, 20, 5)
      mge.fillStyle(0xddbbff, 1)
      mge.fillCircle(40, 20, 2)

      mge.generateTexture('enemy_mage', 44, 44)
      mge.destroy()
    }

    // ── HECHIZO OSCURO (proyectil del Mago enemigo) ───────────────────
    {
      const db = this.make.graphics({ x: 0, y: 0, add: false })
      db.fillStyle(0x5522aa, 0.5)
      db.fillCircle(9, 9, 9)
      db.fillStyle(0x9955ee, 0.9)
      db.fillCircle(9, 9, 6)
      db.fillStyle(0xddbbff, 1)
      db.fillCircle(9, 9, 3)
      db.fillStyle(0xffffff, 1)
      db.fillCircle(8, 8, 1.5)
      db.generateTexture('dark-bolt', 18, 18)
      db.destroy()
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

    // ── PROYECTIL ARCANO (bastón del Mago) ───────────────────────────
    {
      const mb = this.make.graphics({ x: 0, y: 0, add: false })
      mb.fillStyle(0x3355cc, 0.5)
      mb.fillCircle(9, 9, 9)
      mb.fillStyle(0x66aaff, 0.9)
      mb.fillCircle(9, 9, 6)
      mb.fillStyle(0xaaddff, 1)
      mb.fillCircle(9, 9, 3)
      mb.fillStyle(0xffffff, 1)
      mb.fillCircle(8, 8, 1.5)
      mb.generateTexture('mana-bolt', 18, 18)
      mb.destroy()
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