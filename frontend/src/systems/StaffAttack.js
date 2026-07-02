// systems/StaffAttack.js
// Maneja el ataque a distancia del Mago (SPACE o clic izquierdo).
// Dispara un proyectil arcano hacia el cursor. Cooldown mayor que la espada,
// pero cada impacto aplica el daño de playerStore.damage (más alto en el Mago).

import Phaser from 'phaser'
import { useGameStore } from '@/stores/gameStore'

const BOLT_SPEED      = 480   // px/segundo
const BOLT_COOLDOWN   = 550   // ms entre disparos
const BOLT_LIFETIME   = 1400  // ms antes de autodestruirse
const BOLT_HIT_RADIUS = 20    // px — radio de impacto contra enemigos

export class StaffAttack {
  constructor(scene, playerSprite, enemyManager, playerStore) {
    this.gameStore    = useGameStore()
    this.scene        = scene
    this.player       = playerSprite
    this.enemyManager = enemyManager
    this.playerStore  = playerStore

    this.lastAttack = 0
    this.boltGroup  = scene.physics.add.group()

    // Colisión de los proyectiles contra el escenario (limpiada automáticamente
    // por GameScene._destroyRoomSystems al cambiar de sala)
    if (scene.walls) {
      scene.physics.add.collider(this.boltGroup, scene.walls, (bolt) => {
        this._impactFx(bolt.x, bolt.y); bolt.destroy()
      })
    }
    if (scene.obstacles) {
      scene.physics.add.collider(this.boltGroup, scene.obstacles, (bolt) => {
        this._impactFx(bolt.x, bolt.y); bolt.destroy()
      })
    }

    // Tecla SPACE
    this._spaceKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )

    // Clic izquierdo
    this._pointerHandler = (ptr) => {
      if (ptr.leftButtonDown()) this._tryAttack(scene.time.now)
    }
    scene.input.on('pointerdown', this._pointerHandler)
  }

  update(time) {
    if (Phaser.Input.Keyboard.JustDown(this._spaceKey)) {
      this._tryAttack(time)
    }
    this._tickBolts(time)
  }

  // Dirección hacia el cursor (igual que SwordAttack, para consistencia)
  _getFacingAngle() {
    const ptr = this.scene.input.activePointer
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

  _tryAttack(time) {
    if (time - this.lastAttack < BOLT_COOLDOWN) return
    this.lastAttack = time
    this._fireBolt(time)
  }

  _fireBolt(time) {
    const angle = this._getFacingAngle()
    this.player.setFlipX(Math.cos(angle) < 0)

    const startX = this.player.x + Math.cos(angle) * 16
    const startY = this.player.y + Math.sin(angle) * 16

    const bolt = this.boltGroup.create(startX, startY, 'mana-bolt')
    bolt.setDisplaySize(16, 16)
    bolt.setDepth(6)
    bolt.setRotation(angle)
    bolt.body.setAllowGravity(false)
    bolt.setVelocity(Math.cos(angle) * BOLT_SPEED, Math.sin(angle) * BOLT_SPEED)
    bolt._spawnTime = time

    // Destello de disparo en la punta del bastón
    const flash = this.scene.add.circle(startX, startY, 10, 0x66ccff, 0.7).setDepth(7)
    this.scene.tweens.add({
      targets: flash, scale: 2.2, alpha: 0, duration: 180,
      onComplete: () => flash.destroy()
    })

    // Pequeño retroceso visual del mago al disparar
    this.scene.tweens.add({
      targets: this.player, scaleX: 1.08, scaleY: 0.94,
      duration: 90, yoyo: true, ease: 'Power2'
    })
  }

  _tickBolts(time) {
    const GAME_W = 900, GAME_H = 600

    this.boltGroup.getChildren().forEach(bolt => {
      if (!bolt.active) return

      // Estela de partículas
      if (Math.random() < 0.55) {
        const trail = this.scene.add.circle(bolt.x, bolt.y, 3, 0x88ddff, 0.5).setDepth(5)
        this.scene.tweens.add({
          targets: trail, alpha: 0, scale: 0.3, duration: 220,
          onComplete: () => trail.destroy()
        })
      }

      // Expira por tiempo de vida o al salir de la pantalla
      if (time - bolt._spawnTime > BOLT_LIFETIME ||
          bolt.x < -20 || bolt.x > GAME_W + 20 || bolt.y < -20 || bolt.y > GAME_H + 20) {
        bolt.destroy()
        return
      }

      // Colisión contra enemigos (chequeo manual por distancia, igual que SwordAttack)
      for (const enemy of this.enemyManager.enemies) {
        if (!enemy.isAlive) continue
        const dist = Phaser.Math.Distance.Between(bolt.x, bolt.y, enemy.x, enemy.y)
        if (dist > BOLT_HIT_RADIUS) continue

        this._onHit(enemy)
        bolt.destroy()
        break
      }
    })
  }

  _onHit(enemy) {
    const died = enemy.takeDamage(this.playerStore.damage)

    this.scene.cameras.main.shake(90, 0.008)

    if (enemy.sprite) {
      enemy.sprite.setTint(0x66ccff)
      this.scene.time.delayedCall(90, () => {
        if (enemy.sprite && enemy.sprite.active) enemy.sprite.clearTint()
      })
    }

    this._impactFx(enemy.x, enemy.y)

    if (died) {
      this.enemyManager.gameStore.enemiesDefeated++
      this.playerStore.gainXp(enemy.config.xpReward)
      if (this.playerStore.pendingUpgrade) this.gameStore.openUpgrade()
    }

    // Knockback leve al enemigo golpeado
    const angleToEnemy = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y)
    const kb = 140
    enemy.sprite.setVelocity(Math.cos(angleToEnemy) * kb, Math.sin(angleToEnemy) * kb)
  }

  // Explosión arcana al impactar contra un muro, obstáculo o enemigo
  _impactFx(x, y) {
    const gfx = this.scene.add.graphics().setDepth(15)
    const sparks = []
    for (let i = 0; i < 8; i++) {
      sparks.push({
        angle: Phaser.Math.FloatBetween(0, Math.PI * 2),
        speed: Phaser.Math.FloatBetween(120, 260)
      })
    }

    this.scene.tweens.add({
      targets: { progress: 0 },
      progress: 1,
      duration: 200,
      ease: 'Expo.easeOut',
      onUpdate: function (tween, target) {
        gfx.clear()
        gfx.lineStyle(2, 0x66ccff, 1 - target.progress)
        sparks.forEach(s => {
          const d  = s.speed * (target.progress * 0.12)
          const sx = x + Math.cos(s.angle) * d
          const sy = y + Math.sin(s.angle) * d
          gfx.lineBetween(sx, sy, sx + Math.cos(s.angle) * 8, sy + Math.sin(s.angle) * 8)
        })
        gfx.lineStyle(2, 0xffffff, (1 - target.progress) * 0.7)
        gfx.strokeCircle(x, y, target.progress * 30)
      },
      onComplete: () => gfx.destroy()
    })
  }

  destroy() {
    this.scene.input.off('pointerdown', this._pointerHandler)
    try { this.boltGroup.destroy(true) } catch { /* ignore */ }
  }
}
