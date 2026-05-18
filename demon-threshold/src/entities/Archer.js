// entities/Archer.js  —  Enemigo arquero: mantiene distancia y dispara flechas

import Phaser from 'phaser'
import { ARCHER_BASE, ARCHER_SIZE } from './enemyConfig'

const AI = { PATROL: 'patrol', REPOSITION: 'reposition', SHOOT: 'shoot' }

export class Archer {
  constructor(scene, x, y, group, arrowGroup) {
    this.scene      = scene
    this.config     = { ...ARCHER_BASE }
    this.type       = 'archer'
    this.arrowGroup = arrowGroup  // grupo compartido de flechas

    // Sprite del arquero (azul oscuro para distinguirse)
    this.sprite = group.create(x, y, 'archer')
    this.sprite.setDisplaySize(ARCHER_SIZE, ARCHER_SIZE)
    this.sprite.setDepth(4)
    this.sprite.body.setSize(ARCHER_SIZE * 0.75, ARCHER_SIZE * 0.75)
    this.sprite.body.setOffset(ARCHER_SIZE * 0.125, ARCHER_SIZE * 0.125)
    this.sprite._enemyRef = this

    this.shadow = scene.add.ellipse(x, y + 12, 20, 7, 0x000000, 0.3).setDepth(2)
    this.hpBg   = scene.add.rectangle(x, y - 24, 30, 4, 0x002244).setDepth(10)
    this.hpBar  = scene.add.rectangle(x, y - 24, 30, 4, 0x44aaff).setDepth(11)
    this.hpBar.setOrigin(0.5, 0.5)

    // Indicador de tipo (arco) — pequeño triángulo encima
    this.typeIcon = scene.add.text(x, y - 34, '🏹', {
      fontSize: '10px'
    }).setOrigin(0.5, 0.5).setDepth(12)

    this.hp         = this.config.hp
    this.maxHp      = this.config.hp
    this.state      = AI.PATROL
    this.lastAttack = 0
    this.alive      = true

    this.patrolTarget = { x, y }
    this._newPatrolTarget()

    // Flecha cargándose (indicador visual antes de disparar)
    this._chargeTimer  = 0
    this._charging     = false
    this._chargeCircle = null

    this.sprite.setScale(0)
    scene.tweens.add({
      targets: this.sprite,
      scaleX: 1, scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    })
  }

  update(time, delta, playerSprite) {
    if (!this.alive || !this.sprite.active) return

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y,
      playerSprite.x, playerSprite.y
    )

    // Transición de estado
    if (dist > this.config.detectionRange) {
      this.state = AI.PATROL
      this._cancelCharge()
    } else if (dist < this.config.preferredDist * 0.7) {
      // Demasiado cerca: huye
      this.state = AI.REPOSITION
      this._cancelCharge()
    } else {
      // En rango ideal: disparar
      this.state = AI.SHOOT
    }

    switch (this.state) {
      case AI.PATROL:      this._patrol(); break
      case AI.REPOSITION:  this._reposition(playerSprite); break
      case AI.SHOOT:       this._shoot(time, delta, playerSprite); break
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

  _reposition(playerSprite) {
    // Huir del jugador
    const angle = Phaser.Math.Angle.Between(
      playerSprite.x, playerSprite.y,
      this.sprite.x, this.sprite.y
    )
    this.sprite.setVelocity(
      Math.cos(angle) * this.config.speed,
      Math.sin(angle) * this.config.speed
    )
    this.sprite.setFlipX(Math.cos(angle) < 0)
  }

  _shoot(time, delta, playerSprite) {
    // Quedarse quieto o moverse levemente
    this.sprite.setVelocity(0, 0)

    // Mirar al jugador
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y,
      playerSprite.x, playerSprite.y
    )
    this.sprite.setFlipX(Math.cos(angle) < 0)

    // Carga → disparo
    if (!this._charging) {
      if (this.canAttack(time)) {
        this._startCharge(time)
      }
    } else {
      // Actualizar círculo de carga
      const elapsed = time - this._chargeStart
      const pct     = Math.min(1, elapsed / 700)  // 700ms de carga
      if (this._chargeCircle) {
        this._chargeCircle.setScale(pct)
        this._chargeCircle.setAlpha(0.6 * pct)
      }

      if (elapsed >= 700) {
        // ¡DISPARA!
        this._fireArrow(playerSprite)
        this.lastAttack = time
        this._cancelCharge()
      }
    }
  }

  _startCharge(time) {
    this._charging   = true
    this._chargeStart = time

    // Círculo que crece indicando que va a disparar
    this._chargeCircle = this.scene.add.circle(
      this.sprite.x, this.sprite.y, 20, 0x44aaff, 0.6
    ).setDepth(3).setScale(0)
  }

  _cancelCharge() {
    this._charging = false
    if (this._chargeCircle) {
      this._chargeCircle.destroy()
      this._chargeCircle = null
    }
  }

  _fireArrow(playerSprite) {
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y,
      playerSprite.x, playerSprite.y
    )

    // Crear flecha como sprite de physics
    const arrow = this.arrowGroup.create(this.sprite.x, this.sprite.y, 'arrow')
    arrow.setDisplaySize(18, 6)
    arrow.setDepth(6)
    arrow.setRotation(angle)
    arrow._damage   = this.config.damage
    arrow._fromArcher = true

    const spd = this.config.arrowSpeed
    arrow.setVelocity(Math.cos(angle) * spd, Math.sin(angle) * spd)
    arrow.body.setAllowGravity(false)

    // Destruir flecha si sale de la pantalla o tras 3s
    this.scene.time.delayedCall(3000, () => {
      if (arrow && arrow.active) arrow.destroy()
    })

    // Efecto visual de disparo
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.3,
      duration: 80,
      yoyo: true,
      ease: 'Power2'
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
    this.sprite.setTint(0x88ccff)
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
    this._cancelCharge()

    const gfx = this.scene.add.graphics().setDepth(15)
    gfx.fillStyle(0x44aaff, 1)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const r = 12 + Math.random() * 8
      gfx.fillCircle(
        this.sprite.x + Math.cos(a) * r,
        this.sprite.y + Math.sin(a) * r,
        2 + Math.random() * 3
      )
    }
    this.scene.time.delayedCall(350, () => gfx.destroy())

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0, scaleX: 0, scaleY: 0,
      duration: 250,
      ease: 'Power2',
      onComplete: () => { if (this.sprite) this.sprite.destroy() }
    })

    this.shadow.destroy()
    this.hpBg.destroy()
    this.hpBar.destroy()
    this.typeIcon.destroy()
  }

  _updateUI() {
    const sx = this.sprite.x, sy = this.sprite.y
    this.shadow.setPosition(sx, sy + 12)
    this.hpBg.setPosition(sx, sy - 24)
    this.hpBar.setPosition(sx, sy - 24)
    this.hpBar.setScale(this.hp / this.maxHp, 1)
    this.typeIcon.setPosition(sx, sy - 34)
    if (this._chargeCircle) this._chargeCircle.setPosition(sx, sy)
  }

  destroy() {
    this._cancelCharge()
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
