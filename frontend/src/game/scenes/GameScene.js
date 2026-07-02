import Phaser from 'phaser'
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { PLAYER_SIZE, PLAYER_CLASSES, DEFAULT_CLASS } from '@/entities/playerConfig'
import { EnemyManager }   from '@/systems/EnemyManager'
import { SwordAttack }    from '@/systems/SwordAttack'
import { StaffAttack }    from '@/systems/StaffAttack'
import { RoomBuilder }    from '@/game/RoomBuilder'
import { DUNGEON_MAP, DOOR_DEFS, OPPOSITE_DIR, SPAWN_BY_ENTRY } from '@/game/data/dungeonMap'

const GAME_W = 900
const GAME_H = 600

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }) }

  create() {
    this.gameStore   = useGameStore()
    this.playerStore = usePlayerStore()
    this.playerStore.reset()

    this._roomColliders  = []   // colliders registrados — se limpian al cambiar sala
    this._roomObjects    = []   // objetos visuales — se destruyen al cambiar sala
    this._doors          = []
    this._transitioning  = false

    this._ensureDoorBlockTexture()
    this._createPlayer()
    this._loadRoom(this.gameStore.currentRoomId, null)
    this._setupKeys()
    this._createHint()

    this.debugText = this.add.text(8, GAME_H - 20, '', {
      fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#ffffff44'
    }).setDepth(20)
    this.showDebug = false
    this.input.keyboard.on('keydown-F1', () => { this.showDebug = !this.showDebug })
  }

  update(time, delta) {
    if (this.gameStore.phase !== 'playing') return
    this._handleMovement()
    this.gameStore.addTime(delta)
    if (this.enemyManager)  this.enemyManager.update(time, delta, this.player)
    if (this.attackSystem)  this.attackSystem.update(time)
    if (!this._transitioning) this._checkDoorZones()

    if (this.showDebug) {
      const alive = this.enemyManager?.enemies.filter(e => e.isAlive).length ?? 0
      this.debugText.setText(
        `sala:${this.gameStore.currentRoomId + 1} ` +
        `x:${Math.round(this.player.x)} y:${Math.round(this.player.y)} ` +
        `fps:${Math.round(this.game.loop.actualFps)} en:${alive}`
      )
    } else { this.debugText.setText('') }
  }

  // ── Textura invisible para bloques de puerta ───────────────
  _ensureDoorBlockTexture() {
    if (!this.textures.exists('door-block')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0x000000, 0); g.fillRect(0, 0, 4, 4)
      g.generateTexture('door-block', 4, 4); g.destroy()
    }
  }

  // ── Registrar collider (se borrará al cambiar sala) ────────
  _col(a, b, cb) {
    const c = cb
      ? this.physics.add.collider(a, b, cb, null, this)
      : this.physics.add.collider(a, b)
    this._roomColliders.push(c)
    return c
  }

  // ═══════════════════════════════════════════════════════════
  //  CARGA DE SALA
  // ═══════════════════════════════════════════════════════════
  _loadRoom(roomId, entryDir) {
    // 1. Limpiar sala anterior (colliders PRIMERO, luego objetos)
    this._destroyRoomSystems()

    const roomData    = this.gameStore.dungeonRooms[roomId] ?? DUNGEON_MAP.rooms[roomId]
    const connections = roomData.connections ?? {}
    const doorDirs    = Object.keys(connections)

    // 2. Construir sala — RoomBuilder devuelve los objetos visuales
    const { walls, obstacles, visualObjects } = RoomBuilder.build(
      this, roomId, roomData.layout ?? 'open', doorDirs
    )
    this.walls     = walls
    this.obstacles = obstacles

    // 3. Guardar visualObjects para que se destruyan en la próxima sala
    this._roomObjects = visualObjects

    // 4. Puertas
    this._createDoors(connections, roomData)

    // 5. Colisiones jugador ↔ mundo
    this._col(this.player, this.walls)
    if (this.obstacles) this._col(this.player, this.obstacles)

    // 6. Posicionar jugador
    if (entryDir) {
      const sp = SPAWN_BY_ENTRY[entryDir]
      this.player.setPosition(sp.x, sp.y)
    } else {
      this.player.setPosition(GAME_W / 2, GAME_H / 2)
    }
    this.player.setVelocity(0, 0)

    // 7. Enemigos
    this._setupEnemies(roomData)

    // 8. Sistema de ataque — depende de la clase elegida (Guerrero → espada, Mago → bastón)
    const classInfo   = PLAYER_CLASSES[this.playerStore.characterClass] ?? PLAYER_CLASSES[DEFAULT_CLASS]
    const AttackClass = classInfo.attack === 'staff' ? StaffAttack : SwordAttack
    this.attackSystem  = new AttackClass(
      this, this.player, this.enemyManager, this.playerStore
    )

    this.gameStore.enterRoom(roomId)
    if (roomId !== 0) this._showBanner(roomData)
  }

  // ── Destrucción limpia ─────────────────────────────────────
  _destroyRoomSystems() {
    // A) ELIMINAR TODOS LOS COLLIDERS DEL MUNDO DE PHYSICS DE GOLPE.
    //    Esto garantiza que no quede NINGÚN colisionador huérfano,
    //    independientemente de si fue registrado en _roomColliders o no.
    //    Es el approach más seguro: más vale destruir todos y recrearlos
    //    en _loadRoom que arriesgarse a dejar alguno sin limpiar.
    try {
      // Método directo de Phaser para limpiar todos los colliders de la escena
      if (this.physics?.world?.colliders) {
        // Obtener todos los activos y removerlos uno a uno
        const active = this.physics.world.colliders.getActive()
        for (let i = active.length - 1; i >= 0; i--) {
          this.physics.world.removeCollider(active[i])
        }
      }
    } catch { /* ignore */ }
    this._roomColliders = []

    // B) Destruir sistemas lógicos
    if (this.enemyManager) { this.enemyManager.destroy(); this.enemyManager = null }
    if (this.attackSystem) { this.attackSystem.destroy(); this.attackSystem = null }

    // C) Destruir grupos de física (seguro ahora que no hay colliders).
    //    destroy(true) elimina el grupo Y todos sus hijos (más limpio que clear).
    if (this.walls)     { try { this.walls.destroy(true) }     catch { /* ignore */ } ; this.walls     = null }
    if (this.obstacles) { try { this.obstacles.destroy(true) } catch { /* ignore */ } ; this.obstacles = null }

    // D) Destruir puertas
    this._doors.forEach(d => {
      if (d.block?.active) d.block.destroy()
      if (d.gfx?.active)   d.gfx.destroy()
    })
    this._doors = []

    // E) Destruir objetos visuales de la sala (suelo, grietas, polvo, etc.)
   this._roomObjects.forEach(o => {
      try {
        if (o && !o.destroyed) {
          this.tweens.killTweensOf(o)   // detener tweens antes de destruir
          o.destroy()
        }
      } catch { /* ignore */ }
    })
    this._roomObjects = []
  }

  // ── Crear puertas ──────────────────────────────────────────
  _createDoors(connections, roomData) {
    const isRoomClear = roomData.cleared === true || roomData.type === 'start'

    for (const [dir, toRoomId] of Object.entries(connections)) {
      const def        = DOOR_DEFS[dir]
      const toRoomData = this.gameStore.dungeonRooms[toRoomId] ?? DUNGEON_MAP.rooms[toRoomId]

      const gfx = this.add.graphics().setDepth(8)
      this._drawDoor(gfx, def, dir, isRoomClear, toRoomData.type)

      let block = null
      if (!isRoomClear) block = this._makeDoorBlock(def)

      const z = def.zone
      const zoneRect = new Phaser.Geom.Rectangle(
        z.x - z.w / 2, z.y - z.h / 2, z.w, z.h
      )
      this._doors.push({ dir, toRoomId, block, gfx, def, zoneRect, isOpen: isRoomClear })
    }
  }

  // ── Bloque físico invisible de puerta ──────────────────────
  _makeDoorBlock(def) {
    const b     = def.block
    const block = this.physics.add.staticImage(b.x, b.y, 'door-block')
    block.setDisplaySize(b.w, b.h).setAlpha(0).refreshBody()
    this._col(this.player, block)
    return block
  }

  // ── Setup enemigos ─────────────────────────────────────────
  _setupEnemies(roomData) {
    this.enemyManager = new EnemyManager(this, this.gameStore, this.playerStore)
    this.enemyManager.setColliderTracker((a, b, cb) => this._col(a, b, cb))
    this.enemyManager.addWallCollider(this.walls)
    if (this.obstacles) this.enemyManager.addObstacleCollider(this.obstacles)

    this.enemyManager.onRoomCleared = () => this._openAllDoors()
    this.enemyManager.onBossDefeated = () => {
      this.time.delayedCall(1800, () => this.gameStore.victory())
    }

    if (roomData.type !== 'start' && !roomData.cleared) {
      this.time.delayedCall(600, () => {
        if (!this.enemyManager || this.enemyManager.destroyed) return

        // Spawn enemigos primero
        this.enemyManager.activate(roomData.type)

        // Luego cerrar puertas
        for (const door of this._doors) {
          door.isOpen = false
          const toRoom = this.gameStore.dungeonRooms[door.toRoomId]
            ?? DUNGEON_MAP.rooms[door.toRoomId]
          this._drawDoor(door.gfx, door.def, door.dir, false, toRoom.type)
          if (!door.block) door.block = this._makeDoorBlock(door.def)
          this._col(this.enemyManager.group, door.block)
        }
      })
    }
  }

  // ── Abrir puertas al limpiar sala ──────────────────────────
  _openAllDoors() {
    for (const door of this._doors) {
      if (door.isOpen) continue
      door.isOpen = true
      if (door.block?.active) { door.block.destroy(); door.block = null }
      const toRoom = this.gameStore.dungeonRooms[door.toRoomId]
        ?? DUNGEON_MAP.rooms[door.toRoomId]
      this._drawDoor(door.gfx, door.def, door.dir, true, toRoom.type)
      const b  = door.def.block
      const fl = this.add.circle(b.x, b.y, 26, 0x00ff66, 0.8).setDepth(15)
      this.tweens.add({ targets: fl, scale: 3, alpha: 0, duration: 480,
        onComplete: () => fl.destroy() })
    }
    const num = this.gameStore.currentRoomId + 1
    const txt = this.add.text(GAME_W / 2, GAME_H / 2 - 40,
      `¡SALA ${num} LIMPIADA!`,
      { fontFamily: "'Press Start 2P'", fontSize: '13px',
        color: '#44ff88', stroke: '#000', strokeThickness: 4 }
    ).setOrigin(0.5).setDepth(100).setAlpha(0)
    this.tweens.add({
      targets: txt, alpha: { from: 0, to: 1 }, y: txt.y - 18,
      duration: 350, hold: 1000, yoyo: true,
      onComplete: () => txt.destroy()
    })
  }

  // ── Dibujar puerta ─────────────────────────────────────────
  _drawDoor(gfx, def, dir, isOpen, toType) {
    gfx.clear()
    const b = def.block
    const x = b.x - b.w / 2, y = b.y - b.h / 2
    const isNS = dir === 'north' || dir === 'south'
    if (isOpen) {
      const c = toType === 'boss' ? 0xff6600 : 0x00bb44
      gfx.fillStyle(c, 0.22); gfx.fillRect(x, y, b.w, b.h)
      gfx.lineStyle(2, c, 0.85); gfx.strokeRect(x, y, b.w, b.h)
      this._arrow(gfx, def.arrow.x, def.arrow.y, def.arrowAngle, c)
    } else {
      gfx.fillStyle(0x330000, 0.9); gfx.fillRect(x, y, b.w, b.h)
      gfx.lineStyle(2, 0x881100, 0.9); gfx.strokeRect(x, y, b.w, b.h)
      gfx.lineStyle(2, 0x552200, 1)
      if (isNS) {
        for (const ox of [-25, 0, 25]) gfx.lineBetween(b.x + ox, y, b.x + ox, y + b.h)
      } else {
        for (const oy of [-25, 0, 25]) gfx.lineBetween(x, b.y + oy, x + b.w, b.y + oy)
      }
      gfx.fillStyle(0x884400, 1); gfx.fillRect(b.x - 6, b.y - 6, 12, 12)
      gfx.lineStyle(1, 0xffaa00, 0.8); gfx.strokeRect(b.x - 6, b.y - 6, 12, 12)
    }
  }

  _arrow(gfx, x, y, angle, color) {
    gfx.lineStyle(3, color, 0.9)
    const ex = x + Math.cos(angle) * 13, ey = y + Math.sin(angle) * 13
    gfx.lineBetween(x, y, ex, ey)
    for (const w of [-0.5, 0.5]) {
      gfx.lineBetween(ex, ey,
        ex + Math.cos(angle + Math.PI + w) * 7,
        ey + Math.sin(angle + Math.PI + w) * 7)
    }
  }

  // ── Detectar zona de puerta ────────────────────────────────
  _checkDoorZones() {
    for (const door of this._doors) {
      if (!door.isOpen) continue
      if (Phaser.Geom.Rectangle.Contains(door.zoneRect, this.player.x, this.player.y)) {
        this._triggerTransition(door); return
      }
    }
  }

  // ── Transición con fade negro ──────────────────────────────
  _triggerTransition(door) {
    this._transitioning = true
    this.player.setVelocity(0, 0)
    const overlay = this.add.rectangle(
      GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x000000, 0
    ).setDepth(200)
    this.tweens.add({
      targets: overlay, alpha: 1, duration: 160,
      onComplete: () => {
        this._loadRoom(door.toRoomId, OPPOSITE_DIR[door.dir])
        this.tweens.add({
          targets: overlay, alpha: 0, duration: 280, delay: 60,
          onComplete: () => { overlay.destroy(); this._transitioning = false }
        })
      }
    })
  }

  // ── Jugador ────────────────────────────────────────────────
  _createPlayer() {
    const classInfo = PLAYER_CLASSES[this.playerStore.characterClass] ?? PLAYER_CLASSES[DEFAULT_CLASS]
    this.player = this.physics.add.sprite(GAME_W / 2, GAME_H / 2, classInfo.texture)
    this.player.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE).setDepth(5)
    this.player.body.setSize(PLAYER_SIZE * 0.7, PLAYER_SIZE * 0.7)
    this.player.body.setOffset(PLAYER_SIZE * 0.15, PLAYER_SIZE * 0.15)
    this.playerShadow = this.add.ellipse(
      this.player.x, this.player.y + 18, 28, 10, 0x000000, 0.4
    ).setDepth(2)
    this.tweens.add({
      targets: this.player, alpha: { from: 0.85, to: 1 },
      duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1
    })
  }

  // ── Banner ─────────────────────────────────────────────────
  _showBanner(roomData) {
    const isBoss = roomData.type === 'boss'
    const num    = this.gameStore.currentRoomId + 1
    const label  = isBoss ? '⚠  SALA DEL JEFE  ⚠' : `SALA ${num}`
    const banner = this.add.text(GAME_W / 2, GAME_H / 2, label, {
      fontFamily: "'Press Start 2P'",
      fontSize: isBoss ? '16px' : '20px',
      color: isBoss ? '#ff5500' : '#ffffff',
      stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(101).setAlpha(0)
    this.tweens.add({
      targets: banner, alpha: { from: 0, to: 1 }, y: GAME_H / 2 - 20,
      duration: 400, ease: 'Power2', yoyo: true, hold: 900,
      onComplete: () => banner.destroy()
    })
  }

  // ── Teclado ────────────────────────────────────────────────
  _setupKeys() {
    this.keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up2:   Phaser.Input.Keyboard.KeyCodes.UP,
      down2: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left2: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right2:Phaser.Input.Keyboard.KeyCodes.RIGHT,
    })
    this.input.keyboard.on('keydown-ESC', () => {
      if (['playing', 'paused'].includes(this.gameStore.phase))
        this.gameStore.togglePause()
    })
  }

  _createHint() {
    const isMage = this.playerStore.characterClass === 'mage'
    const action = isMage ? 'SPACE/Clic hechizo' : 'SPACE/Clic espada'
    const h = this.add.text(GAME_W / 2, GAME_H - 18,
      `WASD mover  |  ${action}  |  Puerta verde: avanzar`,
      { fontFamily: "'Press Start 2P'", fontSize: '5px', color: '#ffffff33' }
    ).setOrigin(0.5).setDepth(20)
    this.tweens.add({ targets: h, alpha: 0, delay: 6000, duration: 1500,
      onComplete: () => h.destroy() })
  }

  // ── Movimiento ─────────────────────────────────────────────
  _handleMovement() {
    const speed = this.playerStore.speed
    let vx = 0, vy = 0
    if (this.keys.left.isDown  || this.keys.left2.isDown)  vx = -1
    if (this.keys.right.isDown || this.keys.right2.isDown) vx =  1
    if (this.keys.up.isDown    || this.keys.up2.isDown)    vy = -1
    if (this.keys.down.isDown  || this.keys.down2.isDown)  vy =  1
    if (vx !== 0 && vy !== 0) { vx *= 0.7071; vy *= 0.7071 }
    this.player.setVelocity(vx * speed, vy * speed)
    if (vx < 0) this.player.setFlipX(true)
    if (vx > 0) this.player.setFlipX(false)
    this.playerShadow?.setPosition(this.player.x, this.player.y + 18)
    this.player.setScale(
      Phaser.Math.Linear(this.player.scaleX, (vx || vy) ? 1.05 : 1.0, 0.15)
    )
  }

  shutdown() { this._destroyRoomSystems() }
  destroy()  { this.shutdown(); super.destroy?.() }
}
