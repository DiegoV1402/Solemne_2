// systems/SwordAttack.js
// Maneja el ataque de espada del jugador (SPACE o clic izquierdo).
// Crea un hitbox temporal en arco frente al jugador.

import Phaser from 'phaser'

const SWORD_DAMAGE   = 25
const SWORD_RANGE    = 70    // px de alcance
const SWORD_ANGLE    = 75    // grados del arco de ataque (a cada lado)
const SWORD_COOLDOWN = 450   // ms entre ataques
const SWORD_DURATION = 160   // ms que el hitbox está activo

export class SwordAttack {
  constructor(scene, playerSprite, enemyManager, playerStore) {
    this.scene         = scene
    this.player        = playerSprite
    this.enemyManager  = enemyManager
    this.playerStore   = playerStore

    this.lastAttack = 0
    this._swingGfx  = null   // Graphics del arco visual

    // Tecla SPACE
    this._spaceKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )

    // Clic izquierdo
    scene.input.on('pointerdown', (ptr) => {
      if (ptr.leftButtonDown()) this._tryAttack(scene.time.now)
    })
  }

  update(time) {
    if (Phaser.Input.Keyboard.JustDown(this._spaceKey)) {
      this._tryAttack(time)
    }
  }

  _tryAttack(time) {
    if (time - this.lastAttack < SWORD_COOLDOWN) return
    this.lastAttack = time

    this._showSwing()
    this._hitEnemies()
  }

  // Dirección del jugador (usa la orientación del flip)
  _getFacingAngle() {
    const ptr = this.scene.input.activePointer
    // Si hay puntero en la escena, usar dirección al cursor
    if (ptr) {
      const cam    = this.scene.cameras.main
      const worldX = ptr.x + cam.scrollX
      const worldY = ptr.y + cam.scrollY
      return Phaser.Math.Angle.Between(
        this.player.x, this.player.y,
        worldX, worldY
      )
    }
    return this.player.flipX ? Math.PI : 0
  }

  _showSwing() {
    if (this._swingGfx) this._swingGfx.destroy()

    const angle   = this._getFacingAngle()
    const halfArc = Phaser.Math.DegToRad(SWORD_ANGLE)

    const gfx = this.scene.add.graphics().setDepth(8)
    gfx.lineStyle(3, 0xffffaa, 0.9)
    gfx.fillStyle(0xffffaa, 0.18)

    // Arco de espada
    gfx.beginPath()
    gfx.moveTo(this.player.x, this.player.y)
    gfx.arc(
      this.player.x, this.player.y,
      SWORD_RANGE,
      angle - halfArc,
      angle + halfArc,
      false
    )
    gfx.closePath()
    gfx.fillPath()
    gfx.strokePath()

    // Línea central brillante (el filo)
    gfx.lineStyle(2, 0xffffff, 1)
    gfx.beginPath()
    gfx.moveTo(this.player.x, this.player.y)
    gfx.lineTo(
      this.player.x + Math.cos(angle) * SWORD_RANGE,
      this.player.y + Math.sin(angle) * SWORD_RANGE
    )
    gfx.strokePath()

    this._swingGfx = gfx

    // Escalar jugador para simular el swing
    this.scene.tweens.add({
      targets: this.player,
      scaleX: 1.2,
      duration: SWORD_DURATION / 2,
      yoyo: true,
      ease: 'Sine.easeOut'
    })

    // Destruir efecto visual
    this.scene.time.delayedCall(SWORD_DURATION, () => {
      if (gfx) gfx.destroy()
      this._swingGfx = null
    })
  }

  _hitEnemies() {
    const angle   = this._getFacingAngle()
    const halfArc = Phaser.Math.DegToRad(SWORD_ANGLE)
    const px = this.player.x
    const py = this.player.y

    for (const enemy of this.enemyManager.enemies) {
      if (!enemy.isAlive) continue

      const dist = Phaser.Math.Distance.Between(px, py, enemy.x, enemy.y)
      if (dist > SWORD_RANGE) continue

      // Verificar si está dentro del arco
      const angleToEnemy = Phaser.Math.Angle.Between(px, py, enemy.x, enemy.y)
      const diff = Phaser.Math.Angle.Wrap(angleToEnemy - angle)
      if (Math.abs(diff) > halfArc) continue

      // ¡Impacto!
      const died = enemy.takeDamage(SWORD_DAMAGE)
      if (died) {
        this.enemyManager.gameStore.enemiesDefeated++
        this.playerStore.gainXp(enemy.config.xpReward)
      }

      // Pequeño knockback al enemigo
      const kb = 200
      enemy.sprite.setVelocity(
        Math.cos(angleToEnemy) * kb,
        Math.sin(angleToEnemy) * kb
      )
    }
  }

  destroy() {
    if (this._swingGfx) this._swingGfx.destroy()
  }
}
