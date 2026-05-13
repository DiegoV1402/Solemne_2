// systems/EnemyManager.js

import { Enemy } from '@/entities/Enemy'
import { ENEMY_SPAWN } from '@/entities/enemyConfig'

const SPAWN_MARGIN = 80
const GAME_W = 900
const GAME_H = 600

export class EnemyManager {
  constructor(scene, gameStore, playerStore) {
    this.scene       = scene
    this.gameStore   = gameStore
    this.playerStore = playerStore

    this.enemies  = []
    this.group    = scene.physics.add.group()
    this.destroyed = false

    // FIX: guardar referencias de timers para limpiarlos
    this.waveTimers = []

    this.waveNumber = 0
    this._spawnWave(ENEMY_SPAWN.initial)
    this._scheduleNextWave()
  }

  // ── Update por frame ──────────────────────────────────────
  update(time, delta, playerSprite) {
    if (this.destroyed) return

    // FIX: solo actualizar si el juego está activo
    if (this.gameStore.phase !== 'playing') return

    this.enemies = this.enemies.filter(e => e.isAlive)

    for (const enemy of this.enemies) {
      enemy.update(time, delta, playerSprite)

      if (enemy.canAttack(time)) {
        const dist = Phaser.Math.Distance.Between(
          enemy.x, enemy.y,
          playerSprite.x, playerSprite.y
        )
        if (dist < 28) {
          enemy.registerAttack(time)
          this._dealDamageToPlayer(playerSprite, enemy)
        }
      }
    }
  }

  _dealDamageToPlayer(playerSprite, enemy) {
    this.playerStore.takeDamage(enemy.config.damage)

    const angle = Phaser.Math.Angle.Between(
      enemy.x, enemy.y,
      playerSprite.x, playerSprite.y
    )
    const kb = enemy.config.knockback
    playerSprite.setVelocity(Math.cos(angle) * kb, Math.sin(angle) * kb)

    playerSprite.setTint(0xff0000)
    this.scene.time.delayedCall(200, () => {
      if (playerSprite && playerSprite.active) playerSprite.clearTint()
    })

    if (!this.playerStore.isAlive) {
      this.gameStore.gameOver()
    }
  }

  damageEnemy(enemySprite, amount) {
    const enemy = enemySprite._enemyRef
    if (!enemy) return
    const died = enemy.takeDamage(amount)
    if (died) {
      this.gameStore.enemiesDefeated++
      this.playerStore.gainXp(enemy.config.xpReward)
    }
  }

  addWallCollider(walls) {
    this.scene.physics.add.collider(this.group, walls)
    this.scene.physics.add.collider(this.group, this.group)
  }

  addPlayerOverlap(playerSprite, onOverlap) {
    this.scene.physics.add.overlap(
      playerSprite, this.group,
      (player, enemySpr) => onOverlap && onOverlap(player, enemySpr)
    )
  }

  _spawnWave(count) {
    // FIX: no spawnear si el juego terminó
    if (this.destroyed || this.gameStore.phase !== 'playing') return

    const current = this.enemies.filter(e => e.isAlive).length
    const toSpawn = Math.min(count, ENEMY_SPAWN.maxEnemies - current)

    for (let i = 0; i < toSpawn; i++) {
      const pos = this._randomSpawnPos()
      const enemy = new Enemy(this.scene, pos.x, pos.y, this.group)
      this.enemies.push(enemy)
    }

    this.waveNumber++
  }

  _scheduleNextWave() {
    if (this.destroyed) return

    // FIX: guardar timer en array para poder cancelarlos todos
    const t = this.scene.time.addEvent({
      delay: ENEMY_SPAWN.waveInterval,
      callback: () => {
        if (this.destroyed || this.gameStore.phase !== 'playing') return
        const aliveCount = this.enemies.filter(e => e.isAlive).length
        const newCount = Math.min(
          ENEMY_SPAWN.perWave + Math.floor(this.waveNumber * 0.5),
          ENEMY_SPAWN.maxEnemies - aliveCount
        )
        if (newCount > 0) this._spawnWave(newCount)
        this._scheduleNextWave()
      },
    })

    this.waveTimers.push(t)
  }

  _randomSpawnPos() {
    const side = Math.floor(Math.random() * 4)
    let x, y
    switch (side) {
      case 0:
        x = Phaser.Math.Between(SPAWN_MARGIN, GAME_W - SPAWN_MARGIN)
        y = Phaser.Math.Between(SPAWN_MARGIN, SPAWN_MARGIN + 80)
        break
      case 1:
        x = Phaser.Math.Between(SPAWN_MARGIN, GAME_W - SPAWN_MARGIN)
        y = Phaser.Math.Between(GAME_H - SPAWN_MARGIN - 80, GAME_H - SPAWN_MARGIN)
        break
      case 2:
        x = Phaser.Math.Between(SPAWN_MARGIN, SPAWN_MARGIN + 80)
        y = Phaser.Math.Between(SPAWN_MARGIN, GAME_H - SPAWN_MARGIN)
        break
      default:
        x = Phaser.Math.Between(GAME_W - SPAWN_MARGIN - 80, GAME_W - SPAWN_MARGIN)
        y = Phaser.Math.Between(SPAWN_MARGIN, GAME_H - SPAWN_MARGIN)
        break
    }
    return { x, y }
  }

  // FIX: destrucción completa y limpieza de timers
  destroy() {
    this.destroyed = true
    this.waveTimers.forEach(t => { if (t) t.remove() })
    this.waveTimers = []
    this.enemies.forEach(e => e.destroy())
    this.enemies = []
  }

  get enemyGroup() { return this.group }
}
