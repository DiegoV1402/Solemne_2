// entities/Enemy.js
// Clase Enemy: gestiona un solo enemigo con IA de persecución/patrulla.
// Usa Phaser Arcade Physics. Se instancia desde EnemyManager.

import Phaser from 'phaser'
import { ENEMY_BASE, ENEMY_SIZE } from './enemyConfig'

// Estados de la IA
const AI_STATE = {
  PATROL:  'patrol',
  CHASE:   'chase',
  ATTACK:  'attack',
}

export class Enemy {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {Phaser.Physics.Arcade.Group} group  — grupo del enemigo
   */
  constructor(scene, x, y, group) {
    this.scene  = scene
    this.config = { ...ENEMY_BASE }

    // ── Sprite con physics ─────────────────────────────────
    this.sprite = group.create(x, y, 'enemy')
    this.sprite.setDisplaySize(ENEMY_SIZE, ENEMY_SIZE)
    this.sprite.setDepth(4)
    this.sprite.body.setSize(ENEMY_SIZE * 0.75, ENEMY_SIZE * 0.75)
    this.sprite.body.setOffset(ENEMY_SIZE * 0.125, ENEMY_SIZE * 0.125)

    // Referencia inversa para poder identificar el enemy desde el sprite
    this.sprite._enemyRef = this

    // ── Sombra ────────────────────────────────────────────
    this.shadow = scene.add.ellipse(x, y + 14, 22, 8, 0x000000, 0.35).setDepth(2)

    // ── Barra de vida ─────────────────────────────────────
    this.hpBg  = scene.add.rectangle(x, y - 24, 30, 4, 0x440000).setDepth(10)
    this.hpBar = scene.add.rectangle(x, y - 24, 30, 4, 0xff2222).setDepth(11)
    // Pivote izquierdo para escalar fácil
    this.hpBar.setOrigin(0.5, 0.5)

    // ── Stats propios ─────────────────────────────────────
    this.hp         = this.config.hp
    this.maxHp      = this.config.hp
    this.state      = AI_STATE.PATROL
    this.lastAttack = 0
    this.alive      = true

    // Punto de patrulla inicial
    this.patrolTarget = { x, y }
    this._newPatrolTarget()

    // Tween de parpadeo al recibir daño
    this._flashTween = null

    // Efecto de spawn: escalar desde 0
    this.sprite.setScale(0)
    scene.tweens.add({
      targets: this.sprite,
      scaleX: 1, scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    })
  }

  // ── UPDATE (llamado cada frame desde EnemyManager) ────────
  update(time, delta, playerSprite) {
    if (!this.alive || !this.sprite.active) return

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y,
      playerSprite.x, playerSprite.y
    )

    // ── Transición de estado ─────────────────────────────
    if (dist <= this.config.detectionRange) {
      this.state = AI_STATE.CHASE
    } else {
      this.state = AI_STATE.PATROL
    }

    // ── Comportamiento según estado ──────────────────────
    switch (this.state) {
      case AI_STATE.CHASE:
        this._chase(playerSprite, time)
        break
      case AI_STATE.PATROL:
        this._patrol()
        break
    }

    // ── Actualizar UI (shadow, barra HP) ─────────────────
    this._updateUI()
  }

  // ── Persecución ───────────────────────────────────────────
  _chase(playerSprite, time) {
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y,
      playerSprite.x, playerSprite.y
    )
    const spd = this.config.speed
    this.sprite.setVelocity(Math.cos(angle) * spd, Math.sin(angle) * spd)

    // Flip horizontal
    if (Math.cos(angle) < 0) this.sprite.setFlipX(true)
    else                      this.sprite.setFlipX(false)
  }

  // ── Patrulla aleatoria ────────────────────────────────────
  _patrol() {
    const dx   = this.patrolTarget.x - this.sprite.x
    const dy   = this.patrolTarget.y - this.sprite.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 8) {
      // Llegó al objetivo de patrulla, elige otro
      this._newPatrolTarget()
      return
    }

    const spd = this.config.speed * 0.45
    this.sprite.setVelocity((dx / dist) * spd, (dy / dist) * spd)
  }

  // ── Nuevo punto de patrulla aleatorio dentro del rango ────
  _newPatrolTarget() {
    const angle = Math.random() * Math.PI * 2
    const r     = this.config.patrolRange * (0.3 + Math.random() * 0.7)
    this.patrolTarget = {
      x: Phaser.Math.Clamp(this.sprite.x + Math.cos(angle) * r, 60, 840),
      y: Phaser.Math.Clamp(this.sprite.y + Math.sin(angle) * r, 60, 540),
    }
  }

  // ── Recibir daño ─────────────────────────────────────────
  takeDamage(amount) {
    if (!this.alive) return false
    this.hp = Math.max(0, this.hp - amount)

    // Flash rojo
    this.sprite.setTint(0xff4444)
    this.scene.time.delayedCall(120, () => {
      if (this.sprite && this.sprite.active) this.sprite.clearTint()
    })

    if (this.hp <= 0) {
      this._die()
      return true // murió
    }
    return false
  }

  // ── Puede atacar al jugador ahora? ───────────────────────
  canAttack(time) {
    return this.alive && (time - this.lastAttack) >= this.config.attackCooldown
  }

  registerAttack(time) {
    this.lastAttack = time
  }

  // ── Muerte ────────────────────────────────────────────────
  _die() {
    this.alive = false

    // Partículas de muerte
    const gfx = this.scene.add.graphics().setDepth(15)
    gfx.fillStyle(0xff2222, 1)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const r = 14 + Math.random() * 10
      gfx.fillCircle(
        this.sprite.x + Math.cos(angle) * r,
        this.sprite.y + Math.sin(angle) * r,
        3 + Math.random() * 3
      )
    }
    this.scene.time.delayedCall(400, () => gfx.destroy())

    // Desvanecimiento
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleX: 0, scaleY: 0,
      duration: 250,
      ease: 'Power2',
      onComplete: () => { this.sprite.destroy() }
    })

    this.shadow.destroy()
    this.hpBg.destroy()
    this.hpBar.destroy()
  }

  // ── UI (shadow + barra HP) ────────────────────────────────
  _updateUI() {
    const sx = this.sprite.x
    const sy = this.sprite.y
    this.shadow.setPosition(sx, sy + 14)
    this.hpBg.setPosition(sx, sy - 24)
    this.hpBar.setPosition(sx, sy - 24)

    const pct = this.hp / this.maxHp
    this.hpBar.setScale(pct, 1)
  }

  // ── Destruir todo (limpieza) ──────────────────────────────
  destroy() {
    if (this.sprite && this.sprite.active) this.sprite.destroy()
    if (this.shadow)  this.shadow.destroy()
    if (this.hpBg)    this.hpBg.destroy()
    if (this.hpBar)   this.hpBar.destroy()
  }

  get isAlive() { return this.alive }
  get x()       { return this.sprite.x }
  get y()       { return this.sprite.y }
}
