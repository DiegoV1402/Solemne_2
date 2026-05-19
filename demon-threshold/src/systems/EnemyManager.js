// systems/EnemyManager.js

import Phaser from 'phaser'
import { Enemy }  from '@/entities/Enemy'
import { Archer } from '@/entities/Archer'
import { ENEMY_SPAWN } from '@/entities/enemyConfig'

const SPAWN_MARGIN = 80
const GAME_W = 900
const GAME_H = 600

export class EnemyManager {
  constructor(scene, gameStore, playerStore) {
    this.scene       = scene
    this.gameStore   = gameStore
    this.playerStore = playerStore

    this.enemies    = []          // Enemy[] + Archer[]
    this.group      = scene.physics.add.group()   // sprites de enemigos
    this.arrowGroup = scene.physics.add.group()   // sprites de flechas
    this.destroyed  = false
    this.waveTimers = []
    this.waveNumber = 0

    this._spawnWave(ENEMY_SPAWN.initial)
    this._scheduleNextWave()
  }

  // ── Update ────────────────────────────────────────────────
  update(time, delta, playerSprite) {
    if (this.destroyed || this.gameStore.phase !== 'playing') return

    this.enemies = this.enemies.filter(e => e.isAlive)

    for (const enemy of this.enemies) {
      enemy.update(time, delta, playerSprite)

      // Solo melee ataca por contacto
      if (enemy.type === 'melee' && enemy.canAttack(time)) {
        const dist = Phaser.Math.Distance.Between(
          enemy.x, enemy.y, playerSprite.x, playerSprite.y
        )
        if (dist < 28) {
          enemy.registerAttack(time)
          this._dealMeleeDamage(playerSprite, enemy)
        }
      }
    }

    // Mover flechas y comprobar colisión con jugador
    this._updateArrows(playerSprite)
  }

  _updateArrows(playerSprite) {
    this.arrowGroup.getChildren().forEach(arrow => {
      if (!arrow.active) return

      // Fuera de pantalla → destruir
      if (arrow.x < 0 || arrow.x > GAME_W || arrow.y < 0 || arrow.y > GAME_H) {
        arrow.destroy()
        return
      }

      // Colisión con jugador
      const dist = Phaser.Math.Distance.Between(
        arrow.x, arrow.y, playerSprite.x, playerSprite.y
      )
      if (dist < 22) {
        this._dealArrowDamage(playerSprite, arrow)
        arrow.destroy()
      }
    })
  }

  _dealMeleeDamage(playerSprite, enemy) {
    this.playerStore.takeDamage(enemy.config.damage)
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, playerSprite.x, playerSprite.y)
    playerSprite.setVelocity(
      Math.cos(angle) * enemy.config.knockback,
      Math.sin(angle) * enemy.config.knockback
    )
    this._flashPlayer(playerSprite)
    if (!this.playerStore.isAlive) this.gameStore.gameOver()
  }

  _dealArrowDamage(playerSprite, arrow) {
    this.playerStore.takeDamage(arrow._damage || 12)
    // Knockback en la dirección de la flecha
    const angle = arrow.rotation
    playerSprite.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150)
    this._flashPlayer(playerSprite)

    // Pequeño efecto de impacto
    const hit = this.scene.add.circle(arrow.x, arrow.y, 8, 0x44aaff, 0.8).setDepth(15)
    this.scene.tweens.add({
      targets: hit,
      alpha: 0, scaleX: 2, scaleY: 2,
      duration: 200,
      onComplete: () => hit.destroy()
    })

    if (!this.playerStore.isAlive) this.gameStore.gameOver()
  }

  _flashPlayer(playerSprite) {
    playerSprite.setTint(0xff0000)
    this.scene.time.delayedCall(200, () => {
      if (playerSprite && playerSprite.active) playerSprite.clearTint()
    })
  }

  // ── Colisión flechas con paredes ─────────────────────────
  addWallCollider(walls) {
    this.scene.physics.add.collider(this.group, walls)
    this.scene.physics.add.collider(this.group, this.group)

    // Flechas se destruyen al tocar paredes
    this.scene.physics.add.collider(this.arrowGroup, walls, (arrow) => {
      // Efecto de impacto en muro
      const spark = this.scene.add.circle(arrow.x, arrow.y, 5, 0xffcc44, 0.9).setDepth(15)
      this.scene.tweens.add({
        targets: spark,
        alpha: 0, scale: 2,
        duration: 150,
        onComplete: () => spark.destroy()
      })
      arrow.destroy()
    })
  }

  // ── Spawn ─────────────────────────────────────────────────
  _spawnWave(count) {
    if (this.destroyed || this.gameStore.phase !== 'playing') return

    const current = this.enemies.filter(e => e.isAlive).length
    const toSpawn = Math.min(count, ENEMY_SPAWN.maxEnemies - current)

    for (let i = 0; i < toSpawn; i++) {
      const pos     = this._randomSpawnPos()
      const isArcher = Math.random() < ENEMY_SPAWN.archerChance

      const enemy = isArcher
        ? new Archer(this.scene, pos.x, pos.y, this.group, this.arrowGroup)
        : new Enemy(this.scene, pos.x, pos.y, this.group)

      this.enemies.push(enemy)
    }

    this.waveNumber++
  }

  _scheduleNextWave() {
    if (this.destroyed) return
    const t = this.scene.time.addEvent({
      delay: ENEMY_SPAWN.waveInterval,
      callback: () => {
        if (this.destroyed || this.gameStore.phase !== 'playing') return
        const alive    = this.enemies.filter(e => e.isAlive).length
        const newCount = Math.min(
          ENEMY_SPAWN.perWave + Math.floor(this.waveNumber * 0.5),
          ENEMY_SPAWN.maxEnemies - alive
        )
        if (newCount > 0) this._spawnWave(newCount)
        this._scheduleNextWave()
      }
    })
    this.waveTimers.push(t)
  }

  _randomSpawnPos() {
    const side = Math.floor(Math.random() * 4)
    let x, y
    switch (side) {
      case 0: x = Phaser.Math.Between(SPAWN_MARGIN, GAME_W - SPAWN_MARGIN); y = Phaser.Math.Between(SPAWN_MARGIN, SPAWN_MARGIN + 80); break
      case 1: x = Phaser.Math.Between(SPAWN_MARGIN, GAME_W - SPAWN_MARGIN); y = Phaser.Math.Between(GAME_H - SPAWN_MARGIN - 80, GAME_H - SPAWN_MARGIN); break
      case 2: x = Phaser.Math.Between(SPAWN_MARGIN, SPAWN_MARGIN + 80);     y = Phaser.Math.Between(SPAWN_MARGIN, GAME_H - SPAWN_MARGIN); break
      default: x = Phaser.Math.Between(GAME_W - SPAWN_MARGIN - 80, GAME_W - SPAWN_MARGIN); y = Phaser.Math.Between(SPAWN_MARGIN, GAME_H - SPAWN_MARGIN); break
    }
    return { x, y }
  }

  destroy() {
    this.destroyed = true
    this.waveTimers.forEach(t => { if (t) t.remove() })
    this.waveTimers = []
    this.enemies.forEach(e => e.destroy())
    this.enemies = []
    this.arrowGroup.clear(true, true)
  }

  get enemyGroup()  { return this.group }
  get arrowsGroup() { return this.arrowGroup }
}
