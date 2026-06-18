// systems/movement.js
// Composable encargado de leer el teclado y mover al jugador.
// Se monta/desmonta automáticamente con el componente que lo use.

import { onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useGameStore }   from '@/stores/gameStore'

export function useMovementSystem() {
  const playerStore = usePlayerStore()
  const gameStore   = useGameStore()

  // Set de teclas actualmente presionadas
  const keysHeld = new Set()

  // ── Listeners de teclado ────────────────────────────────
  const onKeyDown = (e) => {
    // Evitar scroll de página con flechas
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
      e.preventDefault()
    }
    keysHeld.add(e.key.toLowerCase())
  }

  const onKeyUp = (e) => {
    keysHeld.delete(e.key.toLowerCase())
  }

  // ── Función de actualización (llamada cada frame) ────────
  /**
   * Calcula la dirección de movimiento y delega al playerStore.
   * @param {number} deltaMs  tiempo en ms desde el último frame
   */
  function update(deltaMs) {
    // Solo mover si el juego está activo
    if (!gameStore.isPlaying) return

    let dx = 0
    let dy = 0

    // WASD + teclas de flecha como alternativa
    if (keysHeld.has('w') || keysHeld.has('arrowup'))    dy -= 1
    if (keysHeld.has('s') || keysHeld.has('arrowdown'))  dy += 1
    if (keysHeld.has('a') || keysHeld.has('arrowleft'))  dx -= 1
    if (keysHeld.has('d') || keysHeld.has('arrowright')) dx += 1

    // ── Normalización diagonal ───────────────────────────
    // Sin esto, moverse en diagonal es √2 ≈ 1.41× más rápido.
    if (dx !== 0 && dy !== 0) {
      const INV_SQRT2 = 0.7071067811865476  // 1/√2 pre-calculado
      dx *= INV_SQRT2
      dy *= INV_SQRT2
    }

    playerStore.move(dx, dy, deltaMs)
  }

  // ── Montar/desmontar listeners al ciclo de vida del componente ──
  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup',   onKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup',   onKeyUp)
    keysHeld.clear()
  })

  return { update }
}
