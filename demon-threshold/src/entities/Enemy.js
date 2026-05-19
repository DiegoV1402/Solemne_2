// entities/Enemy.js  —  Enemigo cuerpo a cuerpo (melee)

import Phaser from 'phaser'
import { ENEMY_BASE, ENEMY_SIZE } from './enemyConfig'

const AI = { PATROL: 'patrol', CHASE: 'chase' }

export class Enemy {
  constructor(scene, x, y, group) {
    this.scene  = scene
    this.config = { ...ENEMY_BASE }
    this.type   = 'melee'

    this.sprite = group.create(x, y, 'enemy')
    this.sprite.setDisplaySize(ENEMY_SIZE, ENEMY_SIZE)
    this.sprite.setDepth(4)
    this.sprite.body.setSize(ENEMY_SIZE * 0.75, ENEMY_SIZE * 0.75)
    this.sprite.body.setOffset(ENEMY_SIZE * 0.125, ENEMY_SIZE * 0.125)
    this.sprite._enemyRef = this

    this.shadow = scene.add.ellipse(x, y + 14, 22, 8, 0x000000, 0.35).setDepth(2)
    this.hpBg   = scene.add.rectangle(x, y - 24, 30, 4, 0x440000).setDepth(10)
    this.hpBar  = scene.add.rectangle(x, y - 24, 30, 4, 0xff2222).setDepth(11)
    this.hpBar.setOrigin(0.5, 0.5)

    this.hp         = this.config.hp
    this.maxHp      = this.config.hp
    this.state      = AI.PATROL
    this.lastAttack = 0
    this.alive      = true

    this.patrolTarget = { x, y }
    this._newPatrolTarget()

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

    this.state = dist <= this.config.detectionRange ? AI.CHASE : AI.PATROL

    if (this.state === AI.CHASE) this._chase(playerSprite)
    else                         this._patrol()

    this._updateUI()
  }

  _chase(playerSprite) {
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y,
      playerSprite.x, playerSprite.y
    )
    this.sprite.setVelocity(
      Math.cos(angle) * this.config.speed,
      Math.sin(angle) * this.config.speed
    )
    this.sprite.setFlipX(Math.cos(angle) < 0)
  }

  _patrol() {
    const dx   = this.patrolTarget.x - this.sprite.x
    const dy   = this.patrolTarget.y - this.sprite.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 8) { this._newPatrolTarget(); return }
    const spd = this.config.speed * 0.45
    this.sprite.setVelocity((dx / dist) * spd, (dy / dist) * spd)
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
    this.sprite.setTint(0xff4444)
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
    const gfx = this.scene.add.graphics().setDepth(15)
    gfx.fillStyle(0xff2222, 1)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const r = 14 + Math.random() * 10
      gfx.fillCircle(
        this.sprite.x + Math.cos(a) * r,
        this.sprite.y + Math.sin(a) * r,
        3 + Math.random() * 3
      )
    }
    this.scene.time.delayedCall(400, () => gfx.destroy())
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
  }

  _updateUI() {
    const sx = this.sprite.x, sy = this.sprite.y
    this.shadow.setPosition(sx, sy + 14)
    this.hpBg.setPosition(sx, sy - 24)
    this.hpBar.setPosition(sx, sy - 24)
    this.hpBar.setScale(this.hp / this.maxHp, 1)
  }

  destroy() {
    if (this.sprite && this.sprite.active) this.sprite.destroy()
    if (this.shadow) this.shadow.destroy()
    if (this.hpBg)   this.hpBg.destroy()
    if (this.hpBar)  this.hpBar.destroy()
  }

  get isAlive() { return this.alive }
  get x()       { return this.sprite.x }
  get y()       { return this.sprite.y }
}
