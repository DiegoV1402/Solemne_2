// systems/SwordAttack.js
// Maneja el ataque de espada del jugador (SPACE o clic izquierdo).
// Dibuja una espada física y la rota para crear un barrido de ataque.

import Phaser from 'phaser'
import { useGameStore } from '@/stores/gameStore'

const SWORD_DAMAGE   = 25
const SWORD_RANGE    = 70    // px de alcance de la espada
const SWORD_ANGLE    = 75    // grados del arco de ataque (a cada lado)
const SWORD_COOLDOWN = 450   // ms entre ataques
const SWORD_DURATION = 160   // ms que dura la animación del espadazo

export class SwordAttack {
  constructor(scene, playerSprite, enemyManager, playerStore) {
    this.gameStore = useGameStore()
    this.scene         = scene
    this.player        = playerSprite
    this.enemyManager  = enemyManager
    this.playerStore   = playerStore

    this.lastAttack = 0
    this._swingGfx  = null   // Rastro visual
    this._swordGfx  = null   // Objeto físico de la espada

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
    if (this._swordGfx) this._swordGfx.destroy()

    const baseAngle = this._getFacingAngle()
    const halfArc = Phaser.Math.DegToRad(SWORD_ANGLE)
    
    // Ángulo inicial y final del espadazo
    const startAngle = baseAngle - halfArc
    const endAngle = baseAngle + halfArc

    // 1. Gráfico para el rastro que deja la espada
    this._swingGfx = this.scene.add.graphics().setDepth(11)

    // 2. Gráfico para dibujar LA ESPADA
    const sword = this.scene.add.graphics().setDepth(12)
    this._swordGfx = sword
    
    // Posicionamos la espada en el centro del jugador
    sword.setPosition(this.player.x, this.player.y)
    // Le damos la rotación inicial
    sword.rotation = startAngle

    // --- DIBUJO DE LA ESPADA (apuntando hacia la derecha, ángulo 0) ---
    // Mango (Hilt) - Marrón
    sword.lineStyle(6, 0x5c3a21, 1)
    sword.beginPath()
    sword.moveTo(10, 0) // Empieza a 10px del centro del personaje
    sword.lineTo(25, 0)
    sword.strokePath()

    // Guarda (Guard) - Dorada
    sword.lineStyle(4, 0xffd700, 1)
    sword.beginPath()
    sword.moveTo(25, -12)
    sword.lineTo(25, 12)
    sword.strokePath()

    // Hoja (Blade) - Plateada y afilada
    sword.fillStyle(0xeeeeee, 1)
    sword.lineStyle(2, 0xaaaaaa, 1)
    sword.beginPath()
    sword.moveTo(25, -5)
    sword.lineTo(SWORD_RANGE, 0) // Punta de la espada
    sword.lineTo(25, 5)
    sword.closePath()
    sword.fillPath()
    sword.strokePath()
    // -------------------------------------------------------------------

    // 3. ANIMACIÓN: Rotar la espada desde startAngle hasta endAngle
    this.scene.tweens.add({
      targets: sword,
      rotation: endAngle,
      duration: SWORD_DURATION,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        // Validación de seguridad
        if (!sword || !this.player || !this.player.active) return
        
        // Mantener la espada atada al jugador si este se mueve mientras ataca
        sword.setPosition(this.player.x, this.player.y)

        // Dibujar el rastro difuminado a medida que la espada se mueve
        this._swingGfx.clear()
        this._swingGfx.fillStyle(0xffffff, 0.15) // Rastro blanco semitransparente
        this._swingGfx.beginPath()
        this._swingGfx.moveTo(this.player.x, this.player.y)
        this._swingGfx.arc(
          this.player.x, this.player.y,
          SWORD_RANGE - 2, // Ligeramente más pequeño que la punta
          startAngle,
          sword.rotation, // Sigue la rotación actual de la espada
          false
        )
        this._swingGfx.closePath()
        this._swingGfx.fillPath()
      },
      onComplete: () => {
        // Destruir la espada y el rastro al terminar el golpe
        if (sword) sword.destroy()
        if (this._swingGfx) this._swingGfx.destroy()
        this._swordGfx = null
        this._swingGfx = null
      }
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
      const died = enemy.takeDamage(this.playerStore.damage)

      // =================================═════════════════════════
      // EFECTOS VISUALES AL IMPACTAR ENEMIGO
      // =================================═════════════════════════
      
      // 1. Temblor Sísmico de Cámara
      this.scene.cameras.main.shake(120, 0.012);

      // 2. Destello de Daño Rojo
      if (enemy.sprite) {
        enemy.sprite.setTint(0xff2222);
        this.scene.time.delayedCall(80, () => {
          if (enemy.sprite && enemy.sprite.active) enemy.sprite.clearTint();
        });
      }

      // 3. Onda de Choque de Luz y Explosión
      const impactGfx = this.scene.add.graphics().setDepth(15);
      const sparks = [];
      const sparkCount = 10;
      
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({
          angle: Phaser.Math.FloatBetween(0, Math.PI * 2),
          speed: Phaser.Math.FloatBetween(180, 340),
          length: Phaser.Math.FloatBetween(12, 28)
        });
      }

      const ex = enemy.x;
      const ey = enemy.y;

      this.scene.tweens.add({
        targets: { progress: 0 },
        progress: 1,
        duration: 220,
        ease: 'Expo.easeOut',
        onUpdate: function (tween, target) {
          impactGfx.clear();
          impactGfx.lineStyle(3, 0xffaa00, 1 - target.progress);
          sparks.forEach(s => {
            const distanceTravelled = s.speed * (target.progress * 0.15);
            const startX = ex + Math.cos(s.angle) * distanceTravelled;
            const startY = ey + Math.sin(s.angle) * distanceTravelled;
            const endX = startX + Math.cos(s.angle) * s.length;
            const endY = startY + Math.sin(s.angle) * s.length;
            impactGfx.lineBetween(startX, startY, endX, endY);
          });
          impactGfx.lineStyle(2, 0xffffff, (1 - target.progress) * 0.8);
          impactGfx.strokeCircle(ex, ey, target.progress * 45);
          
          if (target.progress < 0.5) {
            impactGfx.fillStyle(0xffffff, (1 - target.progress * 2));
            impactGfx.fillCircle(ex, ey, (1 - target.progress * 2) * 15);
          }
        },
        onComplete: () => {
          impactGfx.destroy();
        }
      });
      // =================================═════════════════════════

      if (died) {
        this.enemyManager.gameStore.enemiesDefeated++
        this.playerStore.gainXp(enemy.config.xpReward)
        if (this.playerStore.pendingUpgrade) this.gameStore.openUpgrade()
      }

      // Knockback al enemigo
      const kb = 200
      enemy.sprite.setVelocity(
        Math.cos(angleToEnemy) * kb,
        Math.sin(angleToEnemy) * kb
      )
    }
  }

  destroy() {
    if (this._swingGfx) this._swingGfx.destroy()
    if (this._swordGfx) this._swordGfx.destroy()
  }
}