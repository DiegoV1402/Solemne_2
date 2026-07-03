// entities/MageEnemy.js  —  Enemigo Mago: hechicero a distancia que se
// teletransporta (blink) para escapar cuando el jugador se acerca demasiado.
// Aparece en las salas que se desbloquean tras derrotar al jefe final.

import Phaser from 'phaser'
import { MAGE_BASE, MAGE_SIZE } from './enemyConfig'

const AI = { PATROL: 'patrol', BLINK: 'blink', CAST: 'cast' }

export class MageEnemy {
  constructor(scene, x, y, group, boltGroup, configOverride = null) {
    this.scene    = scene
    this.config   = configOverride ? { ...configOverride } : { ...MAGE_BASE }
    this.type     = 'mage'
    this.boltGroup = boltGroup   // grupo compartido de hechizos (igual que arrowGroup)

    // Sprite del mago (textura generada en PreloadScene)
    this.sprite = group.create(x, y, 'enemy_mage')
    this.sprite.setDisplaySize(MAGE_SIZE, MAGE_SIZE)
    this.sprite.setDepth(4)
    this.sprite.body.setSize(MAGE_SIZE * 0.7, MAGE_SIZE * 0.7)
    this.sprite.body.setOffset(MAGE_SIZE * 0.15, MAGE_SIZE * 0.15)
    this.sprite._enemyRef = this

    this.shadow = scene.add.ellipse(x, y + 13, 22, 8, 0x000000, 0.35).setDepth(2)
    this.hpBg   = scene.add.rectangle(x, y - 24, 30, 4, 0x2a0044).setDepth(10)
    this.hpBar  = scene.add.rectangle(x, y - 24, 30, 4, 0xaa55ff).setDepth(11)
    this.hpBar.setOrigin(0.5, 0.5)

    this.typeIcon = scene.add.text(x, y - 34, '🔮', {
      fontSize: '10px'
    }).setOrigin(0.5, 0.5).setDepth(12)

    this.hp         = this.config.hp
    this.maxHp      = this.config.hp
    this.state      = AI.PATROL
    this.lastAttack = 0
    this.lastBlink  = -99999
    this.alive      = true

    this.patrolTarget = { x, y }
    this._newPatrolTarget()

    this._charging     = false
    this._chargeCircle = null

    this.sprite.setScale(0)
    scene.tweens.add({
      targets: this.sprite, scaleX: 1, scaleY: 1,
      duration: 300, ease: 'Back.easeOut'
    })
  }

  update(time, delta, playerSprite) {
    if (!this.alive || !this.sprite.active) return

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y, playerSprite.x, playerSprite.y
    )

    if (dist > this.config.detectionRange) {
      this.state = AI.PATROL
      this._cancelCast()
    } else if (dist < this.config.teleportRange && this._canBlink(time)) {
      this._blinkAway(playerSprite, time)
    } else if (this.state !== AI.BLINK) {
      this.state = AI.CAST
    }

    switch (this.state) {
      case AI.PATROL: this._patrol(); break
      case AI.CAST:   this._cast(time, playerSprite); break
      // BLINK se resuelve instantáneamente en _blinkAway, no necesita tick
    }

    this._updateUI()
  }

  _patrol() {
    const dx = this.patrolTarget.x - this.sprite.x
    const dy = this.patrolTarget.y - this.sprite.y
    const d  = Math.sqrt(dx * dx + dy * dy)
    if (d < 8) { this._newPatrolTarget(); return }
    const spd = this.config.speed * 0.4
    this.sprite.setVelocity((dx / d) * spd, (dy / d) * spd)
  }

  _cast(time, playerSprite) {
    this.sprite.setVelocity(0, 0)
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y, playerSprite.x, playerSprite.y
    )
    this.sprite.setFlipX(Math.cos(angle) < 0)

    if (!this._charging) {
      if (this.canAttack(time)) this._startCharge(time)
    } else {
      const elapsed = time - this._chargeStart
      const pct     = Math.min(1, elapsed / 900) // 900ms de canalización
      if (this._chargeCircle) {
        this._chargeCircle.setScale(pct)
        this._chargeCircle.setAlpha(0.55 * pct)
      }
      if (elapsed >= 900) {
        this._castBolt(playerSprite)
        this.lastAttack = time
        this._cancelCast()
      }
    }
  }

  _startCharge(time) {
    this._charging    = true
    this._chargeStart = time
    this._chargeCircle = this.scene.add.circle(
      this.sprite.x, this.sprite.y, 22, 0xaa55ff, 0.55
    ).setDepth(3).setScale(0)
  }

  _cancelCast() {
    this._charging = false
    if (this._chargeCircle) { this._chargeCircle.destroy(); this._chargeCircle = null }
  }

  _castBolt(playerSprite) {
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y, playerSprite.x, playerSprite.y
    )

    const bolt = this.boltGroup.create(this.sprite.x, this.sprite.y, 'dark-bolt')
    bolt.setDisplaySize(18, 18)
    bolt.setDepth(6)
    bolt.setRotation(angle)
    bolt._damage      = this.config.damage
    bolt._fromMage    = true
    bolt.body.setAllowGravity(false)
    bolt.setVelocity(Math.cos(angle) * this.config.boltSpeed, Math.sin(angle) * this.config.boltSpeed)

    this.scene.time.delayedCall(3000, () => { if (bolt && bolt.active) bolt.destroy() })

    this.scene.tweens.add({
      targets: this.sprite, scaleX: 1.25, scaleY: 0.85,
      duration: 90, yoyo: true, ease: 'Power2'
    })
  }

  // ── Blink: se teletransporta lejos del jugador cuando lo tiene encima ──
  _canBlink(time) { return this.alive && (time - this.lastBlink) >= this.config.teleportCooldown }

  _blinkAway(playerSprite, time) {
    this.state     = AI.BLINK
    this.lastBlink = time
    this._cancelCast()

    const fromX = this.sprite.x, fromY = this.sprite.y
    const away  = Phaser.Math.Angle.Between(playerSprite.x, playerSprite.y, this.sprite.x, this.sprite.y)
    const dist  = 150 + Math.random() * 60
    const nx    = Phaser.Math.Clamp(this.sprite.x + Math.cos(away) * dist, 60, 840)
    const ny    = Phaser.Math.Clamp(this.sprite.y + Math.sin(away) * dist, 60, 540)

    // Efecto de desvanecimiento en el origen
    const puffOut = this.scene.add.circle(fromX, fromY, 4, 0xaa55ff, 0.8).setDepth(6)
    this.scene.tweens.add({ targets: puffOut, scale: 8, alpha: 0, duration: 260, onComplete: () => puffOut.destroy() })

    this.sprite.setVelocity(0, 0)
    this.sprite.setAlpha(0)
    this.sprite.setPosition(nx, ny)
    this.patrolTarget = { x: nx, y: ny }

    // Efecto de aparición en el destino
    const puffIn = this.scene.add.circle(nx, ny, 4, 0xaa55ff, 0.8).setDepth(6)
    this.scene.tweens.add({ targets: puffIn, scale: 8, alpha: 0, duration: 260, onComplete: () => puffIn.destroy() })
    this.scene.tweens.add({
      targets: this.sprite, alpha: 1, duration: 180,
      onComplete: () => { if (this.alive) this.state = AI.CAST }
    })
  }

  _newPatrolTarget() {
    const angle = Math.random() * Math.PI * 2
    const r     = this.config.patrolRange * (0.3 + Math.random() * 0.7)
    this.patrolTarget = {
      x: Phaser.Math.Clamp(this.sprite.x + Math.cos(angle) * r, 60, 840),
      y: Phaser.Math.Clamp(this.sprite.y + Math.sin(angle) * r, 60, 540),
    }
  }

  takeDamage(amount) {
    if (!this.alive) return false
    this.hp = Math.max(0, this.hp - amount)
    this.sprite.setTint(0xddbbff)
    this.scene.time.delayedCall(120, () => {
      if (this.sprite && this.sprite.active) this.sprite.clearTint()
    })
    if (this.hp <= 0) { this._die(); return true }
    return false
  }

  canAttack(time) {
    return this.alive && (time - this.lastAttack) >= this.config.attackCooldown
  }

  registerAttack(time) { this.lastAttack = time }

  _die() {
    this.alive = false
    this._cancelCast()

    const gfx = this.scene.add.graphics().setDepth(15)
    gfx.fillStyle(0xaa55ff, 1)
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2
      const r = 12 + Math.random() * 10
      gfx.fillCircle(
        this.sprite.x + Math.cos(a) * r,
        this.sprite.y + Math.sin(a) * r,
        2 + Math.random() * 3
      )
    }
    this.scene.time.delayedCall(350, () => gfx.destroy())

    this.scene.tweens.add({
      targets: this.sprite, alpha: 0, scaleX: 0, scaleY: 0,
      duration: 250, ease: 'Power2',
      onComplete: () => { if (this.sprite) this.sprite.destroy() }
    })

    this.shadow.destroy()
    this.hpBg.destroy()
    this.hpBar.destroy()
    this.typeIcon.destroy()
  }

  _updateUI() {
    const sx = this.sprite.x, sy = this.sprite.y
    this.shadow.setPosition(sx, sy + 13)
    this.hpBg.setPosition(sx, sy - 24)
    this.hpBar.setPosition(sx, sy - 24)
    this.hpBar.setScale(this.hp / this.maxHp, 1)
    this.typeIcon.setPosition(sx, sy - 34)
    if (this._chargeCircle) this._chargeCircle.setPosition(sx, sy)
  }

  destroy() {
    this._cancelCast()
    if (this.sprite && this.sprite.active) this.sprite.destroy()
    if (this.shadow)   this.shadow.destroy()
    if (this.hpBg)     this.hpBg.destroy()
    if (this.hpBar)    this.hpBar.destroy()
    if (this.typeIcon) this.typeIcon.destroy()
  }

  get isAlive() { return this.alive }
  get x()       { return this.sprite.x }
  get y()       { return this.sprite.y }
}
