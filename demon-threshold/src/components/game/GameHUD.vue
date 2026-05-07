<template>
  <!--
    HUD renderizado con Vue sobre el canvas de Phaser.
    pointer-events: none para no capturar el mouse que Phaser necesita.
    Solo el botón de pausa tiene pointer-events activo.
  -->
  <div class="hud-overlay">

    <!-- ── Esquina superior izquierda: HP + XP ── -->
    <div class="hud-topleft">
      <!-- Barra de HP -->
      <div class="hud-row">
        <span class="hud-icon">❤️</span>
        <div class="bar-track hp-track">
          <div class="bar-fill hp-fill" :style="{ width: playerStore.hpPercent + '%' }" />
        </div>
        <span class="hud-val">{{ playerStore.hp }}/{{ playerStore.maxHp }}</span>
      </div>

      <!-- Barra de XP -->
      <div class="hud-row">
        <span class="hud-icon xp-icon">✦</span>
        <div class="bar-track xp-track">
          <div class="bar-fill xp-fill" :style="{ width: playerStore.xpPercent + '%' }" />
        </div>
        <span class="hud-val xp-val">Nv.{{ playerStore.level }}</span>
      </div>
    </div>

    <!-- ── Esquina superior derecha: tiempo + pausa ── -->
    <div class="hud-topright">
      <span class="hud-time">⏱ {{ gameStore.elapsedFormatted }}</span>
      <button class="btn-pause" @click="gameStore.togglePause" title="Pausar (ESC)">
        ⏸
      </button>
    </div>

  </div>
</template>

<script setup>
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'

const gameStore   = useGameStore()
const playerStore = usePlayerStore()
</script>

<style scoped>
/* Overlay transparente sobre todo el canvas */
.hud-overlay {
  position: absolute;
  inset: 0;
  width: 900px;
  height: 600px;
  pointer-events: none;   /* no bloquear input a Phaser */
  z-index: 10;
}

/* ── Top izquierdo ──────────────────────────── */
.hud-topleft {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hud-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.hud-icon {
  font-size: 12px;
  width: 16px;
  text-align: center;
}

.xp-icon { color: var(--color-xp); font-size: 10px; }

.bar-track {
  width: 130px;
  height: 11px;
  background: rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.12s ease-out;
}

.hp-fill  { background: linear-gradient(90deg, #991a1a, #ff4444); }
.xp-fill  { background: linear-gradient(90deg, #1077aa, #22aacc); }

.hud-val {
  font-size: 7px;
  color: var(--color-text);
  min-width: 56px;
}

.xp-val { color: var(--color-xp); }

/* ── Top derecho ────────────────────────────── */
.hud-topright {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hud-time {
  font-size: 8px;
  color: var(--color-gold);
  text-shadow: 0 0 8px rgba(201,147,58,0.6);
}

/* El botón SÍ necesita recibir clicks */
.btn-pause {
  pointer-events: all;
  background: rgba(0,0,0,0.5);
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  font-size: 14px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.1s;
}

.btn-pause:hover  { background: rgba(201,147,58,0.2); transform: scale(1.08); }
.btn-pause:active { transform: scale(0.95); }
</style>
