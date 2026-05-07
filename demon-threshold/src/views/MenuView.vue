<template>
  <div class="menu-screen">

    <!-- Fondo animado -->
    <div class="menu-bg" aria-hidden="true">
      <div class="bg-crack c1" />
      <div class="bg-crack c2" />
      <div class="bg-crack c3" />
      <div class="bg-vignette" />
    </div>

    <!-- Título -->
    <header class="menu-header">
      <h1 class="title-line demon">DEMON</h1>
      <h1 class="title-line threshold">THRESHOLD</h1>
      <p class="title-subtitle">☠ &nbsp; LITE &nbsp; ☠</p>
    </header>

    <!-- Botones -->
    <nav class="menu-nav">
      <button class="menu-btn primary" @click="handlePlay">
        <span class="fire-icon">🔥</span>
        JUGAR
        <span class="fire-icon">🔥</span>
      </button>

      <button class="menu-btn" @click="toggleCredits">
        CRÉDITOS
      </button>

      <!-- Créditos expandibles -->
      <transition name="slide-down">
        <div v-if="showCredits" class="credits-box">
          <p>Proyecto universitario · Semana 1 / 4</p>
          <p>Stack: Vue 3 · Pinia · Phaser 3 · Vite</p>
        </div>
      </transition>
    </nav>

    <!-- Controles rápidos -->
    <footer class="menu-footer">
      <span>WASD — Mover</span>
      <span class="sep">·</span>
      <span>ESC — Pausar</span>
      <span class="sep">·</span>
      <span>F1 — Debug</span>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'

const gameStore   = useGameStore()
const playerStore = usePlayerStore()
const showCredits = ref(false)

function handlePlay() {
  playerStore.reset()
  gameStore.startGame()
}

function toggleCredits() {
  showCredits.value = !showCredits.value
}
</script>

<style scoped>
/* ── Pantalla completa ───────────────────────────────────── */
.menu-screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 60%, #1e0a35 0%, #08080f 65%);
}

/* ── Fondo con grietas CSS ──────────────────────────────── */
.menu-bg { position: absolute; inset: 0; pointer-events: none; }

.bg-crack {
  position: absolute;
  inset: 0;
}
.c1 {
  background: linear-gradient(125deg, transparent 42%, rgba(123,47,255,0.18) 50%, transparent 58%);
  animation: crackPulse 5s ease-in-out infinite;
}
.c2 {
  background: linear-gradient(60deg, transparent 42%, rgba(224,90,26,0.10) 50%, transparent 58%);
  animation: crackPulse 7s ease-in-out infinite 1.5s;
}
.c3 {
  background: linear-gradient(200deg, transparent 42%, rgba(123,47,255,0.12) 50%, transparent 58%);
  animation: crackPulse 6s ease-in-out infinite 3s;
}
.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%);
}

@keyframes crackPulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1;   }
}

/* ── Título ─────────────────────────────────────────────── */
.menu-header { text-align: center; position: relative; z-index: 1; }

.title-line {
  font-family: var(--font-title);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 8px;
  display: block;
}

.demon {
  font-size: clamp(52px, 8vw, 100px);
  color: var(--color-gold);
  text-shadow:
    0 0 20px rgba(201,147,58,0.9),
    0 0 60px rgba(201,147,58,0.3),
    3px 3px 0 #2a1500;
  animation: titleGlow 3.5s ease-in-out infinite;
}

.threshold {
  font-size: clamp(34px, 6vw, 74px);
  color: #e8d9c0;
  text-shadow:
    0 0 16px rgba(123,47,255,0.8),
    2px 2px 0 #180030;
}

.title-subtitle {
  font-size: 10px;
  color: rgba(123,47,255,0.65);
  letter-spacing: 6px;
  margin-top: 10px;
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(201,147,58,0.9), 0 0 60px rgba(201,147,58,0.3), 3px 3px 0 #2a1500; }
  50%       { text-shadow: 0 0 35px rgba(201,147,58,1),   0 0 90px rgba(224,90,26,0.45), 3px 3px 0 #2a1500; }
}

/* ── Navegación ─────────────────────────────────────────── */
.menu-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.menu-btn {
  font-family: var(--font-pixel);
  font-size: 12px;
  letter-spacing: 4px;
  color: var(--color-text);
  background: linear-gradient(180deg, #241400 0%, #140c00 100%);
  border: 2px solid var(--color-gold);
  padding: 14px 52px;
  min-width: 290px;
  cursor: pointer;
  transition: all 0.18s ease;
  clip-path: polygon(
    10px 0%, calc(100% - 10px) 0%,
    100% 10px, 100% calc(100% - 10px),
    calc(100% - 10px) 100%, 10px 100%,
    0% calc(100% - 10px), 0% 10px
  );
}

.menu-btn:hover {
  background: linear-gradient(180deg, #4a2a00 0%, #2a1800 100%);
  color: var(--color-gold);
  transform: scale(1.035);
  box-shadow: 0 0 22px rgba(201,147,58,0.35);
}

.menu-btn.primary {
  font-size: 14px;
  padding: 16px 60px;
  border-color: var(--color-fire);
  color: #fff;
  background: linear-gradient(180deg, #5a2000 0%, #341000 100%);
  box-shadow: 0 0 16px rgba(224,90,26,0.4);
}

.menu-btn.primary:hover {
  background: linear-gradient(180deg, #8a3a00 0%, #5a2200 100%);
  box-shadow: 0 0 32px rgba(224,90,26,0.65);
  color: #ffc890;
}

.fire-icon {
  display: inline-block;
  font-size: 15px;
  animation: fireWiggle 0.45s ease-in-out infinite alternate;
}
@keyframes fireWiggle {
  from { transform: rotate(-6deg) scale(0.9); }
  to   { transform: rotate( 6deg) scale(1.1); }
}

/* ── Créditos ────────────────────────────────────────────── */
.credits-box {
  background: rgba(0,0,0,0.65);
  border: 1px solid rgba(123,47,255,0.35);
  padding: 14px 28px;
  font-size: 8px;
  text-align: center;
  line-height: 2;
  color: rgba(232,217,192,0.6);
  width: 290px;
}

/* ── Footer ──────────────────────────────────────────────── */
.menu-footer {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 14px;
  font-size: 7px;
  color: rgba(232,217,192,0.3);
  letter-spacing: 2px;
  z-index: 1;
}
.sep { opacity: 0.35; }

/* ── Transiciones ────────────────────────────────────────── */
.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-leave-active { transition: all 0.18s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-8px); }
</style>
