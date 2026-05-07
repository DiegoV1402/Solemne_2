// game/scenes/GameScene.js
// Escena principal de Phaser. Maneja:
//   - Render del mundo (tilemap con Graphics)
//   - Movimiento WASD del jugador con physics de Arcade
//   - Colisión con paredes
//   - Comunicación bidireccional con Pinia (stores)

import Phaser from 'phaser'
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { PLAYER_SIZE }    from '@/entities/playerConfig'

// Dimensiones internas del canvas
const GAME_W = 900
const GAME_H = 600
const TILE   = 50     // tamaño de cada losa/pared

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  // ── CREATE ────────────────────────────────────────────────
  create() {
    // Obtener stores de Pinia (funcionan fuera de Vue porque Pinia es global)
    this.gameStore   = useGameStore()
    this.playerStore = usePlayerStore()

    // Reset de estadísticas al iniciar escena
    this.playerStore.reset()

    // ── Construcción del mapa ─────────────────────────────
    this._buildRoom()

    // ── Jugador ───────────────────────────────────────────
    this._createPlayer()

    // ── Teclado ───────────────────────────────────────────
    this.keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up2:   Phaser.Input.Keyboard.KeyCodes.UP,
      down2: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left2: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right2:Phaser.Input.Keyboard.KeyCodes.RIGHT,
    })

    // ── Pausa con ESC ─────────────────────────────────────
    this.input.keyboard.on('keydown-ESC', () => {
      this.gameStore.togglePause()
    })

    // ── Partículas decorativas (grietas en el suelo) ──────
    this._createAmbient()

    // ── Texto de debug (F1 para toggle) ───────────────────
    this.debugText = this.add.text(8, GAME_H - 20, '', {
      fontFamily: "'Press Start 2P'",
      fontSize: '7px',
      color: '#ffffff55'
    }).setDepth(20)

    this.showDebug = false
    this.input.keyboard.on('keydown-F1', () => {
      this.showDebug = !this.showDebug
    })
  }

  // ── UPDATE (cada frame) ───────────────────────────────────
  update(time, delta) {
    // Si está pausado, Phaser congela el update automáticamente
    // cuando llamamos scene.pause() desde GameCanvas.vue.
    // Este guard es solo por seguridad.
    if (this.gameStore.phase !== 'playing') return

    this._handleMovement(delta)
    this.gameStore.addTime(delta)

    // Debug
    if (this.showDebug) {
      this.debugText.setText(
        `x:${Math.round(this.player.x)} y:${Math.round(this.player.y)} ` +
        `fps:${Math.round(this.game.loop.actualFps)}`
      )
    } else {
      this.debugText.setText('')
    }
  }

  // ── PRIVATE: construir la sala ────────────────────────────
  _buildRoom() {
    const cols = Math.ceil(GAME_W / TILE)
    const rows = Math.ceil(GAME_H / TILE)

    // Grupo de paredes con physics estático
    this.walls = this.physics.add.staticGroup()

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isWall = row === 0 || row === rows - 1 || col === 0 || col === cols - 1
        const x = col * TILE + TILE / 2
        const y = row * TILE + TILE / 2

        if (isWall) {
          // Tile de pared con physics
          const w = this.walls.create(x, y, 'wall')
          w.setDisplaySize(TILE, TILE)
          w.refreshBody()
        } else {
          // Tile de suelo (solo visual, sin physics)
          this.add.image(x, y, 'floor').setDisplaySize(TILE, TILE).setDepth(0)
        }
      }
    }

    // Grieta decorativa con Graphics (efecto visual)
    this._drawCracks()
  }

  // ── PRIVATE: grietas en el suelo (puro visual) ───────────
  _drawCracks() {
    const gfx = this.add.graphics().setDepth(1).setAlpha(0.18)
    gfx.lineStyle(2, 0x7b2fff, 1)

    // Grietas aleatorias predefinidas (aspecto roguelike)
    const cracks = [
      [[200, 300], [270, 340], [310, 290], [400, 330]],
      [[500, 200], [540, 270], [480, 310], [520, 380]],
      [[650, 400], [700, 360], [740, 420], [780, 390]],
      [[150, 450], [200, 410], [250, 460]],
      [[400, 150], [450, 180], [420, 220]],
    ]

    cracks.forEach(points => {
      gfx.beginPath()
      gfx.moveTo(points[0][0], points[0][1])
      for (let i = 1; i < points.length; i++) {
        gfx.lineTo(points[i][0], points[i][1])
      }
      gfx.strokePath()
    })
  }

  // ── PRIVATE: crear el jugador ─────────────────────────────
  _createPlayer() {
    // Centro de la sala
    this.player = this.physics.add.sprite(GAME_W / 2, GAME_H / 2, 'player')
    this.player.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE)
    this.player.setDepth(5)
    // Hitbox más pequeña que el sprite para mejor feel
    this.player.body.setSize(PLAYER_SIZE * 0.7, PLAYER_SIZE * 0.7)
    this.player.body.setOffset(PLAYER_SIZE * 0.15, PLAYER_SIZE * 0.15)

    // Colisión jugador ↔ paredes
    this.physics.add.collider(this.player, this.walls)

    // Sombra en el suelo (solo visual)
    this.playerShadow = this.add.ellipse(
      this.player.x, this.player.y + 18,
      28, 10,
      0x000000, 0.4
    ).setDepth(2)

    // Glow parpadeante (tweens de Phaser)
    this.tweens.add({
      targets: this.player,
      alpha: { from: 0.85, to: 1 },
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    })
  }

  // ── PRIVATE: efectos ambientales ──────────────────────────
  _createAmbient() {
    // Partículas de polvo púrpura flotando (Phaser 3.60+ API)
    const dustPositions = [
      { x: 180, y: 280 }, { x: 450, y: 180 },
      { x: 700, y: 350 }, { x: 300, y: 450 },
      { x: 600, y: 480 }, { x: 820, y: 200 },
    ]

    dustPositions.forEach(pos => {
      const dust = this.add.circle(pos.x, pos.y, 3, 0x7b2fff, 0.5).setDepth(1)
      this.tweens.add({
        targets: dust,
        y: pos.y - 20,
        alpha: { from: 0.5, to: 0 },
        duration: Phaser.Math.Between(2000, 4000),
        ease: 'Sine.easeOut',
        yoyo: false,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
        onRepeat: () => {
          dust.setPosition(pos.x + Phaser.Math.Between(-15, 15), pos.y)
          dust.setAlpha(0.5)
        }
      })
    })
  }

  // ── PRIVATE: movimiento ───────────────────────────────────
  _handleMovement(delta) {
    const speed = this.playerStore.speed
    let vx = 0
    let vy = 0

    if (this.keys.left.isDown  || this.keys.left2.isDown)  vx = -1
    if (this.keys.right.isDown || this.keys.right2.isDown) vx =  1
    if (this.keys.up.isDown    || this.keys.up2.isDown)    vy = -1
    if (this.keys.down.isDown  || this.keys.down2.isDown)  vy =  1

    // Normalización diagonal (sin esto ir en diagonal es √2× más rápido)
    if (vx !== 0 && vy !== 0) {
      const INV_SQRT2 = 0.7071067811865476
      vx *= INV_SQRT2
      vy *= INV_SQRT2
    }

    this.player.setVelocity(vx * speed, vy * speed)

    // Flip horizontal según dirección
    if (vx < 0) this.player.setFlipX(true)
    if (vx > 0) this.player.setFlipX(false)

    // Actualizar sombra
    this.playerShadow.setPosition(this.player.x, this.player.y + 18)

    // Efecto de movimiento: escala ligera
    const isMoving = vx !== 0 || vy !== 0
    const targetScale = isMoving ? 1.05 : 1.0
    this.player.setScale(
      Phaser.Math.Linear(this.player.scaleX, targetScale, 0.15)
    )
  }
}
