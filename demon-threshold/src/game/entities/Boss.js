// game/entities/Boss.js
// Boss final: stats reducidas para ser desafiante pero derrotable.
// HP: 180 | Daño: 18/28 | Carga con 2.5s de aviso y estela de fuego

import Phaser from 'phaser'

const BOSS_HP         = 180
const BOSS_SPEED      = 80
const BOSS_CHARGE_SPD = 350 // Aumenté un poco la velocidad para que la estela luzca mejor
const BOSS_DAMAGE     = 18
const BOSS_CHARGE_DMG = 28

const S = { IDLE: 'idle', CHASE: 'chase', WINDUP: 'windup',
            CHARGE: 'charge', RECOVER: 'recover', STOMP: 'stomp', DEAD: 'dead' }

export class Boss {
  constructor(scene, x, y, group, onDie) {
    this.scene   = scene
    this.type    = 'boss'
    this.onDie   = onDie
    this.alive   = true
    this._phase2 = false

    // ── Generar Textura por Código (Pixel Art 72x72) ────────
    this._generateBossTexture(scene)

    // ── Sprite ────────────────────────────────────────────
    this.sprite = group.create(x, y, 'boss_generated')
    // El tamaño ya es 72x72 gracias a la generación, no necesitamos setDisplaySize a menos que quieras distorsionarlo
    this.sprite.setDepth(4)
    this.sprite.body.setSize(48, 48).setOffset(12, 12) // Ajuste de hitbox al nuevo tamaño
    this.sprite.body.setMaxVelocity(400, 400)

    this.shadow = scene.add.ellipse(x, y + 30, 50, 14, 0x000000, 0.45).setDepth(2)

    this.hp    = BOSS_HP
    this.maxHp = BOSS_HP

    this.state       = S.IDLE
    this.stateTimer  = 0
    this.damageCooldown = 0
    this._chgVx = 0; this._chgVy = 0
    this._alert = null
    this._stompActive = false

    // Animación de entrada
    this.sprite.setAlpha(0).setScale(0)
    scene.tweens.add({ targets: this.sprite, alpha: 1, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back.easeOut' })

    const flashOverlay = scene.add.rectangle(450, 300, 900, 600, 0xaa0000, 0.35).setDepth(50)
    scene.tweens.add({ targets: flashOverlay, alpha: 0, duration: 400, onComplete: () => flashOverlay.destroy() })

    const nameText = scene.add.text(450, 300, '⬡ GUARDIÁN CORRUPTO ⬡',
      { fontFamily: "'Press Start 2P'", fontSize: '13px', color: '#ff3333', stroke: '#000', strokeThickness: 4 }
    ).setOrigin(0.5).setDepth(100).setAlpha(0)
    scene.tweens.add({ targets: nameText, alpha: 1, y: 250, duration: 400, hold: 1400, yoyo: true, onComplete: () => nameText.destroy() })

    // Barra HP
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
        if (dist < 600) { this.state = S.CHASE; this.stateTimer = 3500 }
        break

      case S.CHASE:
        this._moveTo(player)
        if (this.stateTimer <= 0) this._startWindup(player)
        if (this._phase2 && this.stateTimer <= 1200 && Math.random() < 0.004) this._startStomp()
        break

      case S.WINDUP:
        this.sprite.setVelocity(0, 0)
        if (this.stateTimer <= 0) {
          if (this._alert) { this._alert.destroy(); this._alert = null }
          this.state = S.CHARGE; this.stateTimer = 550
          this.sprite.setVelocity(this._chgVx, this._chgVy)
        }
        break

      case S.CHARGE:
        // ── EFECTO DE EMBESTIDA (Estela de Fuego) ──
        if (time % 60 < 20) { // Crea un "fantasma" cada ciertos milisegundos
           const ghost = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'boss_generated').setDepth(3)
           ghost.setFlipX(this.sprite.flipX)
           ghost.setTint(this._phase2 ? 0xffbb00 : 0xff4400) // Amarillo en fase 2, Naranja normal
           ghost.setAlpha(0.6)
           this.scene.tweens.add({ targets: ghost, alpha: 0, scale: 0.6, duration: 300, onComplete: () => ghost.destroy() })
        }

        if (this.stateTimer <= 0 || dist < 32) {
          this.state = S.RECOVER; this.stateTimer = this._phase2 ? 1000 : 1600
          this.sprite.setVelocity(0, 0)
          const slam = this.scene.add.circle(this.sprite.x, this.sprite.y, 45, 0xff4400, 0.6).setDepth(6)
          this.scene.tweens.add({ targets: slam, scale: 2, alpha: 0, duration: 280, onComplete: () => slam.destroy() })
        }
        break

      case S.RECOVER:
        this.sprite.setVelocity(0, 0)
        if (this.stateTimer <= 0) {
          this.state = S.CHASE; this.stateTimer = this._phase2 ? 2000 : 3000
        }
        break

      case S.STOMP:
        this.sprite.setVelocity(0, 0)
        if (this.stateTimer <= 0) {
          const ring = this.scene.add.circle(this.sprite.x, this.sprite.y, 100, 0xff2200, 0.45).setDepth(6)
          this.scene.tweens.add({ targets: ring, scale: 1.6, alpha: 0, duration: 350, onComplete: () => ring.destroy() })
          this._stompActive = true
          this.scene.time.delayedCall(200, () => { this._stompActive = false })
          this.state = S.CHASE; this.stateTimer = 2800
        }
        break
    }

    // UI
    this.shadow?.setPosition(this.sprite.x, this.sprite.y + 30)
    if (this._alert?.active) this._alert.setPosition(this.sprite.x, this.sprite.y)
    this._updateBossBar()
  }

  _moveTo(target) {
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y)
    this.sprite.setVelocity(Math.cos(angle) * BOSS_SPEED, Math.sin(angle) * BOSS_SPEED)
    this.sprite.setFlipX(Math.cos(angle) < 0)
  }

  _startWindup(player) {
    this.state = S.WINDUP; this.stateTimer = 2500 
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.x, player.y)
    this._chgVx = Math.cos(angle) * BOSS_CHARGE_SPD
    this._chgVy = Math.sin(angle) * BOSS_CHARGE_SPD
    this.sprite.setVelocity(0, 0)

    // Animación de "prepararse para embestir" (se aplasta y vibra)
    this.scene.tweens.add({ targets: this.sprite, scaleX: 1.25, scaleY: 0.8, duration: 350, yoyo: true, repeat: 4, ease: 'Sine.easeInOut' })

    this._alert = this.scene.add.circle(this.sprite.x, this.sprite.y, 8, 0xff0000, 0.5).setDepth(6)
    this.scene.tweens.add({ targets: this._alert, scaleX: 10, scaleY: 10, alpha: 0, duration: 2500, ease: 'Sine.easeIn' })
  }

  _startStomp() {
    this.state = S.STOMP; this.stateTimer = 700
    this.sprite.setVelocity(0, 0)
  }

  _enterPhase2() {
    this._phase2 = true
    this.sprite.setTint(0xff7700)
    const flash = this.scene.add.circle(this.sprite.x, this.sprite.y, 80, 0xff4400, 0.7).setDepth(50)
    this.scene.tweens.add({ targets: flash, scale: 3, alpha: 0, duration: 500, onComplete: () => flash.destroy() })
    const warn = this.scene.add.text(450, 270, '⚠ FURIA CORRUPTA ⚠',
      { fontFamily: "'Press Start 2P'", fontSize: '11px', color: '#ff7700', stroke: '#000', strokeThickness: 4 }
    ).setOrigin(0.5).setDepth(100)
    this.scene.tweens.add({ targets: warn, alpha: 0, y: 240, duration: 1800, onComplete: () => warn.destroy() })
  }

  canDealDamage()        { return this.damageCooldown <= 0 }
  resetDamageCooldown()  { this.damageCooldown = 950 }
  getDamage()            { return this.state === S.CHARGE ? BOSS_CHARGE_DMG : BOSS_DAMAGE }
  isInStompRange(player) {
    if (!this._stompActive) return false
    return Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y) < 110
  }

  takeDamage(amount) {
    if (!this.alive) return false
    this.hp = Math.max(0, this.hp - amount)
    this.sprite.setTint(0xffffff) // Flash blanco al recibir daño
    this.scene.time.delayedCall(140, () => {
      if (this.sprite?.active) {
        this.sprite.clearTint()
        if (this._phase2) this.sprite.setTint(0xff7700)
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
          i % 2 === 0 ? 0xff3300 : 0xff9900, 0.8
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
    this.bossBarBg    = scene.add.rectangle(X, Y, W + 4, H + 4, 0x220000).setDepth(15).setStrokeStyle(2, 0xff2200)
    this.bossBarFg    = scene.add.rectangle(X - W/2, Y, W, H, 0xff2200).setDepth(16).setOrigin(0, 0.5)
    this.bossBarLabel = scene.add.text(X, Y - 14, 'GUARDIÁN CORRUPTO',
      { fontFamily: "'Press Start 2P'", fontSize: '6px', color: '#ff8888' }
    ).setOrigin(0.5, 0.5).setDepth(16)
  }

  _updateBossBar() {
    if (!this.bossBarFg?.active) return
    const pct = Math.max(0, this.hp / this.maxHp)
    this.bossBarFg.setSize(480 * pct, 16)
    this.bossBarFg.setFillStyle(pct > 0.5 ? 0xff2200 : 0xff7700)
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

  // ── FUNCIÓN PARA "DIBUJAR" EL SPRITE EN EL CÓDIGO ──
  _generateBossTexture(scene) {
    if (scene.textures.exists('boss_generated')) return; // Evita crearlo múltiples veces

    // Paleta de colores infernales
    const colors = {
      '.': null,       // Transparente
      '1': 0x2c1010,   // Borde / Sombra oscura
      '2': 0x691818,   // Rojo oscuro (Cuerpo)
      '3': 0x942929,   // Rojo claro (Músculos)
      '4': 0xff5500,   // Naranja brillante (Fuego/Ojos)
      '5': 0xffdd00,   // Amarillo (Brillo ojos)
      '6': 0xffffff    // Dientes / Cuernos
    };

    // Matriz de 24x24 (Se escalará x3 para que sea 72x72)
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
      '....1222166666612221....',
      '..11122211111111222111..',
      '.1231222222222222221321.',
      '123312233333333332213321',
      '123312333222222333213321',
      '122212332222222233212221',
      '122212333333333333212221',
      '.1111122222222222211111.',
      '.....12221111112221.....',
      '.....12221....12221.....',
      '.....12221....12221.....',
      '.....12221....12221.....',
      '.....11111....11111.....',
      '........................',
      '........................'
    ];

    const pixelSize = 3; // 24 * 3 = 72px
    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    for (let y = 0; y < art.length; y++) {
      for (let x = 0; x < art[y].length; x++) {
        const char = art[y][x];
        if (colors[char] !== null) {
          g.fillStyle(colors[char]);
          g.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    g.generateTexture('boss_generated', 72, 72);
    g.destroy(); // Limpiamos la memoria
  }

  get isAlive() { return this.alive }
  get x()       { return this.sprite?.x ?? 0 }
  get y()       { return this.sprite?.y ?? 0 }
  get config()  { return { damage: BOSS_DAMAGE, xpReward: 150 } }
}