// systems/EnemyManager.js
// Acepta un _colTracker para registrar colliders en GameScene
// y que sean limpiados al cambiar de sala.

import Phaser from 'phaser'
import { Enemy }  from '@/entities/Enemy'
import { Archer } from '@/entities/Archer'
import { Boss }   from '@/game/entities/Boss'
import { ENEMY_BASE, ARCHER_BASE } from '@/entities/enemyConfig'

const GAME_W = 900, GAME_H = 600

export class EnemyManager {
  constructor(scene, gameStore, playerStore) {
    this.scene       = scene
    this.gameStore   = gameStore
    this.playerStore = playerStore

    this.enemies    = []
    this.group      = scene.physics.add.group()
    this.arrowGroup = scene.physics.add.group()
    this.destroyed  = false
    this._activated   = false
    this._roomCleared = false
    this._roomType    = null
    this._colTracker  = null   // función inyectada desde GameScene

    this.onRoomCleared   = null
    this.onBossDefeated  = null
  }

  // GameScene inyecta su función _col para rastrear colliders
  setColliderTracker(fn) { this._colTracker = fn }

  // Helper interno que usa el tracker de GameScene
  _addCol(a, b, cb) {
    if (this._colTracker) return this._colTracker(a, b, cb)
    return cb
      ? this.scene.physics.add.collider(a, b, cb, null, this)
      : this.scene.physics.add.collider(a, b)
  }

  // ── Activar sala ───────────────────────────────────────────
  activate(roomType) {
    if (this._activated || this.destroyed) return
    this._activated = true
    this._roomType  = roomType

    if (roomType === 'boss') {
      this._spawnBoss()
    } else {
      this._spawnEnemies(Phaser.Math.Between(5, 6))
    }
  }

  // ── Update ─────────────────────────────────────────────────
  update(time, delta, player) {
    if (this.destroyed || this.gameStore.phase !== 'playing') return
    if (this._roomCleared) return

    this.enemies = this.enemies.filter(e => e.isAlive)

    for (const e of this.enemies) {
      e.update(time, delta, player)

      if (e.type === 'melee') {
        const d = Phaser.Math.Distance.Between(e.x, e.y, player.x, player.y)
        if (d < 30 && e.canAttack(time)) {
          e.registerAttack(time); this._hitPlayer(player, e)
        }
      }
      if (e.type === 'boss') {
        const d = Phaser.Math.Distance.Between(e.x, e.y, player.x, player.y)
        if (d < 42 && e.canDealDamage?.()) {
          e.resetDamageCooldown?.(); this._hitPlayer(player, e)
        }
        if (e.isInStompRange?.(player)) this._hitPlayer(player, e, 16)
      }
    }

    this._tickArrows(player)

    // Verificar sala limpia
    if (this._activated && !this._roomCleared && this.enemies.filter(e => e.isAlive).length === 0) {
      this._roomCleared = true
      this.gameStore.completeCurrentRoom()
      if (this._roomType !== 'boss' && this.onRoomCleared) this.onRoomCleared()
    }
  }

  // ── Spawn ──────────────────────────────────────────────────
  _spawnEnemies(count) {
    if (this.destroyed) return
    const diff = this.gameStore.difficulty

    for (let i = 0; i < count; i++) {
      const pos = this._rndPos()
      const isA = Math.random() < diff.archerChance
      const cfg = isA ? { ...ARCHER_BASE } : { ...ENEMY_BASE }
      cfg.hp      = Math.round(cfg.hp      * diff.hpMult)
      cfg.speed   = Math.round(cfg.speed   * diff.speedMult)
      cfg.damage  = Math.round(cfg.damage  * diff.damageMult)
      cfg.xpReward = Math.round(cfg.xpReward * (1 + this.gameStore.currentRoomId * 0.08))

      const enemy = isA
        ? new Archer(this.scene, pos.x, pos.y, this.group, this.arrowGroup, cfg)
        : new Enemy (this.scene, pos.x, pos.y, this.group, cfg)
      this.enemies.push(enemy)
    }
  }

  _spawnBoss() {
    const boss = new Boss(this.scene, 450, 200, this.group, () => {
      this.gameStore.enemiesDefeated++
      this.playerStore.gainXp(150)
      if (this.onBossDefeated) this.onBossDefeated()
    })
    this.enemies.push(boss)
  }

  // ── Colisionadores ─────────────────────────────────────────
  addWallCollider(walls) {
    this._addCol(this.group, walls)
    this._addCol(this.group, this.group)
    // Flechas vs paredes
    this.scene.physics.add.collider(this.arrowGroup, walls, (arrow) => {
      this._arrowSpark(arrow.x, arrow.y); arrow.destroy()
    })
  }

  addObstacleCollider(obs) {
    this._addCol(this.group, obs)
    this.scene.physics.add.collider(this.arrowGroup, obs, (arrow) => arrow.destroy())
  }

  // Collider enemigos ↔ bloque de puerta (registrado en GameScene)
  addDoorBlockCollider(block) {
    if (!block?.body) return
    this._addCol(this.group, block)
  }

  // ── Flechas ────────────────────────────────────────────────
  _tickArrows(player) {
    this.arrowGroup.getChildren().forEach(arrow => {
      if (!arrow.active) return
      if (arrow.x < 0 || arrow.x > GAME_W || arrow.y < 0 || arrow.y > GAME_H) {
        arrow.destroy(); return
      }
      const d = Phaser.Math.Distance.Between(arrow.x, arrow.y, player.x, player.y)
      if (d < 22) { this._hitPlayerArrow(player, arrow); arrow.destroy() }
    })
  }

  // ── Daño al jugador ────────────────────────────────────────
  _hitPlayer(player, enemy, dmgOverride = null) {
    const dmg = dmgOverride ?? enemy.config?.damage ?? 8
    this.playerStore.takeDamage(dmg)
    const a = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y)
    const kb = enemy.type === 'boss' ? 260 : 180
    player.setVelocity(Math.cos(a) * kb, Math.sin(a) * kb)
    this._flashPlayer(player)
    if (!this.playerStore.isAlive) this.gameStore.gameOver()
  }

  _hitPlayerArrow(player, arrow) {
    this.playerStore.takeDamage(arrow._damage || 12)
    player.setVelocity(Math.cos(arrow.rotation) * 140, Math.sin(arrow.rotation) * 140)
    this._flashPlayer(player)
    this._arrowSpark(arrow.x, arrow.y)
    if (!this.playerStore.isAlive) this.gameStore.gameOver()
  }

  _flashPlayer(player) {
    player.setTint(0xff2222)
    this.scene.time.delayedCall(210, () => { if (player?.active) player.clearTint() })
  }

  _arrowSpark(x, y) {
    const s = this.scene.add.circle(x, y, 6, 0xffcc44, 0.9).setDepth(15)
    this.scene.tweens.add({ targets: s, scale: 2.2, alpha: 0, duration: 170, onComplete: () => s.destroy() })
  }

  // ── Posición de spawn ──────────────────────────────────────
  _rndPos() {
    const m = 90, side = Math.floor(Math.random() * 4)
    switch (side) {
      case 0: return { x: Phaser.Math.Between(m, GAME_W - m), y: Phaser.Math.Between(m, m + 80) }
      case 1: return { x: Phaser.Math.Between(m, GAME_W - m), y: Phaser.Math.Between(GAME_H - m - 80, GAME_H - m) }
      case 2: return { x: Phaser.Math.Between(m, m + 80),     y: Phaser.Math.Between(m, GAME_H - m) }
      default:return { x: Phaser.Math.Between(GAME_W - m - 80, GAME_W - m), y: Phaser.Math.Between(m, GAME_H - m) }
    }
  }

  destroy() {
    this.destroyed = true
    this.enemies.forEach(e => e.destroy())
    this.enemies = []
    this.arrowGroup.clear(true, true)
  }

  get enemyGroup()  { return this.group }
  get arrowsGroup() { return this.arrowGroup }
}
