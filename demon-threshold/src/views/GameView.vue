<template>
  <!--
    GameView envuelve el canvas de Phaser y el overlay de pausa.
    GameCanvas NUNCA se desmonta aquí — siempre está presente.
    El overlay de pausa es una capa Vue por encima con CSS.
  -->
  <div class="game-view">
    <GameCanvas />

    <!-- Overlay de PAUSA — solo visible cuando phase === 'paused' -->
    <!-- v-show (no v-if) para no destruir nada del DOM -->
    <transition name="pause-fade">
      <div v-show="gameStore.isPaused" class="pause-overlay">
        <div class="pause-panel">

          <div class="pause-ornament top-ornament">✦ ─────── ✦</div>
          <h2 class="pause-title">PAUSA</h2>
          <div class="pause-ornament">✦ ─────── ✦</div>

          <nav class="pause-nav">
            <button class="pause-btn primary" @click="gameStore.togglePause">
              ▶&nbsp; REANUDAR
            </button>
            <button class="pause-btn" @click="handleMenu">
              ⬅&nbsp; MENÚ PRINCIPAL
            </button>
          </nav>

          <!-- Stats rápidas durante la pausa -->
          <div class="pause-stats">
            <span>Nivel {{ playerStore.level }}</span>
            <span class="sep">·</span>
            <span>{{ gameStore.elapsedFormatted }}</span>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import GameCanvas from '@/components/game/GameCanvas.vue'

const gameStore   = useGameStore()
const playerStore = usePlayerStore()

function handleMenu() {
  // gameStore.goToMenu() dispara el watcher en GameCanvas que destruye Phaser
  gameStore.goToMenu()
}
</script>

<style scoped>
.game-view {
  position: relative;
  width: 100vw;
  height: 100vh;
}

/* ── Overlay de pausa ───────────────────────────────────── */
.pause-overlay {
  position: absolute;
  inset: 0;
  /* Oscurecer el canvas sin ocultarlo — el fondo sigue visible */
  background: rgba(0, 0, 0, 0.60);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.pause-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 44px 64px;
  background: linear-gradient(160deg, #1e1008 0%, #100a02 100%);
  border: 2px solid var(--color-gold);
  box-shadow:
    0 0 0 4px rgba(0,0,0,0.6),
    0 0 40px rgba(201,147,58,0.25),
    inset 0 1px 0 rgba(255,255,255,0.05);
  /* Recorte decorativo en las esquinas */
  clip-path: polygon(
    16px 0%, calc(100% - 16px) 0%,
    100% 16px, 100% calc(100% - 16px),
    calc(100% - 16px) 100%, 16px 100%,
    0% calc(100% - 16px), 0% 16px
  );
}

.pause-ornament {
  font-size: 9px;
  color: var(--color-gold);
  letter-spacing: 2px;
  opacity: 0.7;
}
.top-ornament { margin-bottom: -8px; }

.pause-title {
  font-family: var(--font-pixel);
  font-size: 22px;
  color: var(--color-gold);
  letter-spacing: 10px;
  text-shadow:
    0 0 20px rgba(201,147,58,0.7),
    0 0 60px rgba(201,147,58,0.2);
}

/* ── Botones ─────────────────────────────────────────────── */
.pause-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.pause-btn {
  font-family: var(--font-pixel);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--color-text);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(201,147,58,0.5);
  padding: 14px 32px;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: center;
}

.pause-btn:hover {
  background: rgba(201,147,58,0.12);
  color: var(--color-gold);
  border-color: var(--color-gold);
  transform: translateY(-1px);
}

.pause-btn:active { transform: translateY(1px); }

.pause-btn.primary {
  border-color: var(--color-fire);
  color: #fff;
  background: rgba(224,90,26,0.12);
  font-size: 12px;
}

.pause-btn.primary:hover {
  background: rgba(224,90,26,0.25);
  color: #ffa070;
  border-color: #ff7040;
}

/* ── Stats mini ──────────────────────────────────────────── */
.pause-stats {
  font-size: 8px;
  color: rgba(232,217,192,0.4);
  display: flex;
  gap: 10px;
}
.sep { opacity: 0.4; }

/* ── Transición ──────────────────────────────────────────── */
.pause-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.pause-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.pause-fade-enter-from   { opacity: 0; transform: scale(0.97); }
.pause-fade-leave-to     { opacity: 0; transform: scale(0.97); }
</style>
