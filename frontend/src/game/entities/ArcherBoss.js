// game/entities/ArcherBoss.js
// Segundo jefe (final real): Señor Arquero. Más difícil que el Guardián
// Corrupto — mantiene distancia, dispara ráfagas de flechas en abanico y
// se retira de un parpadeo (blink) si el jugador lo acorrala. En fase 2
// (50% HP) dispara más rápido y en mayor número.
// HP: 240 | Daño flecha: 16-22 | Daño contacto: 14

import Phaser from 'phaser'

const BOSS_HP           = 240
const BOSS_SPEED        = 95
const BOSS_DASH_SPD     = 420
const BOSS_CONTACT_DMG  = 14
const BOSS_ARROW_DMG_1  = 16
const BOSS_ARROW_DMG_2  = 22
const PREFERRED_DIST    = 260
const ARROW_SPEED       = 380
const BOSS_IMAGE_SIZE   = 96
const BOSS_BODY_SIZE    = 62
const BOSS_BODY_OFFSET  = 17

const S = { IDLE: 'idle', KITE: 'kite', WINDUP: 'windup', RECOVER: 'recover',
            DASH: 'dash', DEAD: 'dead' }

export class ArcherBoss {
  constructor(scene, x, y, group, arrowGroup, onDie) {
    this.scene      = scene
    this.type       = 'boss'
    this.onDie      = onDie
    this.alive      = true
    this._phase2    = false
    this.arrowGroup = arrowGroup

    this._generateTexture(scene)

    this.sprite = group.create(x, y, 'archer_boss_generated')
    this.sprite.setDisplaySize(BOSS_IMAGE_SIZE, BOSS_IMAGE_SIZE)
    this.sprite.setDepth(4)
    this.sprite.body.setSize(BOSS_BODY_SIZE, BOSS_BODY_SIZE).setOffset(BOSS_BODY_OFFSET, BOSS_BODY_OFFSET)
    this.sprite.body.setMaxVelocity(450, 450)

    this.shadow = scene.add.ellipse(x, y + 34, 68, 20, 0x000000, 0.45).setDepth(2)

    this.hp    = BOSS_HP
    this.maxHp = BOSS_HP

    this.state          = S.IDLE
    this.stateTimer     = 0
    this.damageCooldown = 0
    this.lastVolley      = -99999
    this.lastDash         = -99999
    this._windupTargetAngle = 0
    this._alert = null

    this.sprite.setAlpha(0).setScale(0)
    scene.tweens.add({ targets: this.sprite, alpha: 1, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back.easeOut' })

    const flashOverlay = scene.add.rectangle(450, 300, 900, 600, 0x00aa33, 0.30).setDepth(50)
    scene.tweens.add({ targets: flashOverlay, alpha: 0, duration: 400, onComplete: () => flashOverlay.destroy() })

    const nameText = scene.add.text(450, 300, '☠ SEÑOR ARQUERO ☠',
      { fontFamily: "'Press Start 2P'", fontSize: '13px', color: '#66ff88', stroke: '#000', strokeThickness: 4 }
    ).setOrigin(0.5).setDepth(100).setAlpha(0)
    scene.tweens.add({ targets: nameText, alpha: 1, y: 250, duration: 400, hold: 1400, yoyo: true, onComplete: () => nameText.destroy() })

    this._createBossBar(scene)
  }

  update(time, delta, player) {
    if (!this.alive || !this.sprite?.active) return

    this.stateTimer     -= delta
    this.damageCooldown  = Math.max(0, this.damageCooldown - delta)

    if (!this._phase2 && this.hp <= this.maxHp * 0.5) this._enterPhase2()

    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y)

    switch (this.state) {
      case S.IDLE:
        this.sprite.setVelocity(0, 0)
        if (dist < 650) this.state = S.KITE
        break

      case S.KITE:
        // Muy cerca: parpadea lejos si el cooldown lo permite; si no, se aleja caminando.
        if (dist < 110 && this._canDash(time)) { this._startDash(player, time); break }
        this._kite(player, dist)
        if (this._canVolley(time)) this._startWindup(player)
        break

      case S.WINDUP:
        this.sprite.setVelocity(0, 0)
        if (this.stateTimer <= 0) {
          if (this._alert) { this._alert.destroy(); this._alert = null }
          this._fireVolley(player)
          this.lastVolley = time
          this.state = S.RECOVER
          this.stateTimer = this._phase2 ? 500 : 850
        }
        break

      case S.RECOVER:
        this.sprite.setVelocity(0, 0)
        if (this.stateTimer <= 0) this.state = S.KITE
        break

      case S.DASH:
        if (this.stateTimer <= 0) { this.state = S.KITE; this.sprite.setVelocity(0, 0) }
        break
    }

    this.shadow?.setPosition(this.sprite.x, this.sprite.y + 30)
    if (this._alert?.active) this._alert.setPosition(this.sprite.x, this.sprite.y)
    this._updateBossBar()
  }

  // ── Mantener distancia ideal del jugador ──────────────────
  _kite(player, dist) {
    let angle
    if (dist < PREFERRED_DIST * 0.75) {
      angle = Phaser.Math.Angle.Between(player.x, player.y, this.sprite.x, this.sprite.y) // huir
    } else if (dist > PREFERRED_DIST * 1.35) {
      angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.x, player.y) // acercarse
    } else {
      this.sprite.setVelocity(0, 0)
      this.sprite.setFlipX(player.x < this.sprite.x)
      return
    }
    this.sprite.setVelocity(Math.cos(angle) * BOSS_SPEED, Math.sin(angle) * BOSS_SPEED)
    this.sprite.setFlipX(Math.cos(angle) < 0)
  }

  _canVolley(time) {
    const cd = this._phase2 ? 1300 : 2000
    return (time - this.lastVolley) >= cd
  }

  _startWindup(player) {
    this.state = S.WINDUP
    this.stateTimer = this._phase2 ? 550 : 800
    this.sprite.setVelocity(0, 0)
    this._windupTargetAngle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.x, player.y)
    this.sprite.setFlipX(Math.cos(this._windupTargetAngle) < 0)

    this.scene.tweens.add({ targets: this.sprite, scaleX: 1.15, scaleY: 0.9, duration: 180, yoyo: true, repeat: 2, ease: 'Sine.easeInOut' })

    this._alert = this.scene.add.circle(this.sprite.x, this.sprite.y, 8, 0x66ff88, 0.5).setDepth(6)
    this.scene.tweens.add({ targets: this._alert, scaleX: 7, scaleY: 7, alpha: 0, duration: this.stateTimer, ease: 'Sine.easeIn' })
  }

  // ── Ráfaga de flechas en abanico ──────────────────────────
  _fireVolley(player) {
    const baseAngle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.x, player.y)
    const count  = this._phase2 ? 5 : 3
    const spread = this._phase2 ? 0.5 : 0.32
    const dmg    = this._phase2 ? BOSS_ARROW_DMG_2 : BOSS_ARROW_DMG_1

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : (i / (count - 1)) - 0.5
      const angle = baseAngle + t * spread

      const arrow = this.arrowGroup.create(this.sprite.x, this.sprite.y, 'arrow')
      arrow.setDisplaySize(20, 7)
      arrow.setDepth(6)
      arrow.setRotation(angle)
      arrow._damage = dmg
      arrow._fromArcherBoss = true
      arrow.body.setAllowGravity(false)
      arrow.setVelocity(Math.cos(angle) * ARROW_SPEED, Math.sin(angle) * ARROW_SPEED)
      this.scene.time.delayedCall(2600, () => { if (arrow && arrow.active) arrow.destroy() })
    }

    const flash = this.scene.add.circle(this.sprite.x, this.sprite.y, 26, 0x66ff88, 0.6).setDepth(6)
    this.scene.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 220, onComplete: () => flash.destroy() })
  }

  // ── Parpadeo defensivo cuando el jugador lo acorrala ───────
  _canDash(time) { return (time - this.lastDash) >= 4200 }

  _startDash(player, time) {
    this.state    = S.DASH
    this.lastDash = time
    this.stateTimer = 260

    const away = Phaser.Math.Angle.Between(player.x, player.y, this.sprite.x, this.sprite.y)
    this.sprite.setVelocity(Math.cos(away) * BOSS_DASH_SPD, Math.sin(away) * BOSS_DASH_SPD)
    this.sprite.setFlipX(Math.cos(away) < 0)

    const puff = this.scene.add.circle(this.sprite.x, this.sprite.y, 6, 0x66ff88, 0.7).setDepth(6)
    this.scene.tweens.add({ targets: puff, scale: 6, alpha: 0, duration: 300, onComplete: () => puff.destroy() })
  }

  _enterPhase2() {
    this._phase2 = true
    this.sprite.setTint(0x99ffaa)
    const flash = this.scene.add.circle(this.sprite.x, this.sprite.y, 80, 0x66ff88, 0.7).setDepth(50)
    this.scene.tweens.add({ targets: flash, scale: 3, alpha: 0, duration: 500, onComplete: () => flash.destroy() })
    const warn = this.scene.add.text(450, 270, '⚠ LLUVIA DE FLECHAS ⚠',
      { fontFamily: "'Press Start 2P'", fontSize: '11px', color: '#66ff88', stroke: '#000', strokeThickness: 4 }
    ).setOrigin(0.5).setDepth(100)
    this.scene.tweens.add({ targets: warn, alpha: 0, y: 240, duration: 1800, onComplete: () => warn.destroy() })
  }

  canDealDamage()        { return this.damageCooldown <= 0 }
  resetDamageCooldown()  { this.damageCooldown = 950 }
  getDamage()            { return BOSS_CONTACT_DMG }
  isInStompRange()       { return false } // este jefe no tiene ataque de área en contacto

  takeDamage(amount) {
    if (!this.alive) return false
    this.hp = Math.max(0, this.hp - amount)
    this.sprite.setTint(0xffffff)
    this.scene.time.delayedCall(140, () => {
      if (this.sprite?.active) {
        this.sprite.clearTint()
        if (this._phase2) this.sprite.setTint(0x99ffaa)
      }
    })
    this._updateBossBar()
    if (this.hp <= 0) { this._die(); return true }
    return false
  }

  _die() {
    this.alive = false; this.state = S.DEAD
    this.sprite.setVelocity(0, 0)
    if (this._alert?.active) this._alert.destroy()

    for (let i = 0; i < 7; i++) {
      this.scene.time.delayedCall(i * 120, () => {
        if (!this.scene) return
        const ex = this.scene.add.circle(
          this.sprite?.x ?? 450 + Phaser.Math.Between(-35, 35),
          this.sprite?.y ?? 300 + Phaser.Math.Between(-35, 35),
          Phaser.Math.Between(16, 38),
          i % 2 === 0 ? 0x33cc55 : 0x99ff99, 0.8
        ).setDepth(20)
        this.scene.tweens.add({ targets: ex, scale: 2.2, alpha: 0, duration: 380, onComplete: () => ex.destroy() })
      })
    }

    this.scene.tweens.add({
      targets: this.sprite, alpha: 0, scaleX: 0, scaleY: 0,
      duration: 700, delay: 700, ease: 'Power2',
      onComplete: () => {
        this.shadow?.destroy()
        this.bossBarBg?.destroy()
        this.bossBarFg?.destroy()
        this.bossBarLabel?.destroy()
        this.sprite?.destroy()
        if (this.onDie) this.onDie()
      }
    })
  }

  _createBossBar(scene) {
    const W = 480, H = 16, X = 450, Y = 562
    this.bossBarBg    = scene.add.rectangle(X, Y, W + 4, H + 4, 0x002200).setDepth(15).setStrokeStyle(2, 0x22ff55)
    this.bossBarFg    = scene.add.rectangle(X - W/2, Y, W, H, 0x22ff55).setDepth(16).setOrigin(0, 0.5)
    this.bossBarLabel = scene.add.text(X, Y - 14, 'SEÑOR ARQUERO',
      { fontFamily: "'Press Start 2P'", fontSize: '6px', color: '#99ffaa' }
    ).setOrigin(0.5, 0.5).setDepth(16)
  }

  _updateBossBar() {
    if (!this.bossBarFg?.active) return
    const pct = Math.max(0, this.hp / this.maxHp)
    this.bossBarFg.setSize(480 * pct, 16)
    this.bossBarFg.setFillStyle(pct > 0.5 ? 0x22ff55 : 0x66ff88)
  }

  destroy() {
    this.alive = false
    this._alert?.destroy()
    this.sprite?.destroy()
    this.shadow?.destroy()
    this.bossBarBg?.destroy()
    this.bossBarFg?.destroy()
    this.bossBarLabel?.destroy()
  }

  // ── Textura del jefe generada por código (72x72) ───────────
  _generateTexture(scene) {
    if (scene.textures.exists('archer_boss_generated')) return

    const colors = {
      '.': null,
      '1': 0x081208,   // borde oscuro
      '2': 0x144822,   // verde oscuro (armadura de cuero)
      '3': 0x1e6e32,   // verde medio
      '4': 0x33cc55,   // verde brillante (energía/ojos)
      '5': 0x99ffaa,   // brillo de ojos
      '6': 0xccaa55,   // dorado (arco/detalles)
      '7': 0xffffff,   // dientes
    }

    const art = [
      '........11111111........',
      '......112222222211......',
      '.....12222222222221.....',
      '....1112222222222111....',
      '...123211122221112321...',
      '...123144412214441321...',
      '...123145412214541321...',
      '...122144412214441221...',
      '....1111111111111111....',
      '....1222177777712221....',
      '..11122211111111222111..',
      '.1231222222222222221321.',
      '123312266666666662213321',
      '123312666333333366213321',
      '122212663333333336212221',
      '122212666666666666212221',
      '.1111122222222222211111.',
      '.....12221111112221.....',
      '.....12221....12221.....',
      '.....12221....12221.....',
      '.....12221....12221.....',
      '.....11111....11111.....',
      '........................',
      '........................'
    ]

    const pixelSize = 4
    const g = scene.make.graphics({ x: 0, y: 0, add: false })

    for (let y = 0; y < art.length; y++) {
      for (let x = 0; x < art[y].length; x++) {
        const char = art[y][x]
        if (colors[char] !== null) {
          g.fillStyle(colors[char])
          g.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
        }
      }
    }

    g.generateTexture('archer_boss_generated', 96, 96)
    g.destroy()
  }

  get isAlive() { return this.alive }
  get x()       { return this.sprite?.x ?? 0 }
  get y()       { return this.sprite?.y ?? 0 }
  get config()  { return { damage: BOSS_CONTACT_DMG, xpReward: 220 } }
}
