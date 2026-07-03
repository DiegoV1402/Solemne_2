<template>
  <div class="game-view">
    <GameCanvas />

    <transition name="overlay-fade">
      <div v-show="gameStore.isPaused" class="overlay">
        <div class="panel">
          <div class="ornament">✦ ─────── ✦</div>
          <h2 class="panel-title">PAUSA</h2>
          <div class="ornament">✦ ─────── ✦</div>
          <nav class="panel-nav">
            <button class="btn primary" @click="gameStore.togglePause">▶ REANUDAR</button>
            <button class="btn" @click="handleMenu">⬅ MENÚ PRINCIPAL</button>
          </nav>
          <div class="panel-stats">
            <span>{{ gameStore.roomLabel }}</span><span class="sep">·</span>
            <span>Nivel {{ playerStore.level }}</span><span class="sep">·</span>
            <span>{{ gameStore.elapsedFormatted }}</span>
          </div>
        </div>
      </div>
    </transition>

    <transition name="overlay-fade">
      <div v-show="gameStore.phase === 'victory'" class="overlay victory-overlay">
        <div class="panel victory-panel">
          <div class="ornament gold-ornament">⬡ ──────────────── ⬡</div>
          <h2 class="panel-title victory-title">¡VICTORIA!</h2>
          <p class="victory-sub">EL SEÑOR ARQUERO HA CAÍDO</p>
          <div class="ornament gold-ornament">⬡ ──────────────── ⬡</div>
          <div class="gameover-stats">
            <div class="stat-row"><span class="stat-label">Tiempo</span><span class="stat-val gold">{{ gameStore.elapsedFormatted }}</span></div>
            <div class="stat-row"><span class="stat-label">Nivel alcanzado</span><span class="stat-val gold">{{ playerStore.level }}</span></div>
            <div class="stat-row"><span class="stat-label">Enemigos</span><span class="stat-val gold">{{ gameStore.enemiesDefeated }}</span></div>
          </div>
          <nav class="panel-nav">
            <button class="btn primary" @click="handleRestart">↺ JUGAR DE NUEVO</button>
            <button class="btn" @click="handleMenu">⬅ MENÚ PRINCIPAL</button>
          </nav>
        </div>
      </div>
    </transition>

    <transition name="overlay-fade">
      <div v-show="gameStore.phase === 'gameover'" class="overlay gameover-hades-overlay">
        <div class="gameover-hades-container">
          
          <div class="gameover-header">
            <h1 class="death-title">TU DESTINO HA SIDO SELLADO</h1>
            <h2 class="death-subtitle">MUERTE</h2>
          </div>

          <div class="gameover-content">
            
            <div class="stats-and-progress">
              <div class="stats-panel-hades">
                <div class="stat-row-hades">
                  <span class="stat-label-hades">🚪 SALAS LIMPIADAS</span>
                  <span class="stat-val-hades">{{ gameStore.roomNumber }}</span>
                </div>
                <div class="stat-row-hades">
                  <span class="stat-label-hades">💀 ENEMIGOS DERROTADOS</span>
                  <span class="stat-val-hades">{{ gameStore.enemiesDefeated }}</span>
                </div>
                <div class="stat-row-hades">
                  <span class="stat-label-hades">⏳ TIEMPO DE LA PARTIDA</span>
                  <span class="stat-val-hades">{{ gameStore.elapsedFormatted }}</span>
                </div>
                <div class="stat-row-hades">
                  <span class="stat-label-hades">🟣 NIVEL ALCANZADO</span>
                  <span class="stat-val-hades">{{ playerStore.level }}</span>
                </div>
                
              </div>
            </div>

            <div class="actions-panel">
              <button class="hades-btn primary-hades" @click="handleRestart">REINTENTAR</button>
              <button class="hades-btn secondary-hades" @click="handleMenu">VOLVER AL MENÚ</button>
            </div>

          </div>
        </div>
      </div>
    </transition>

    <transition name="upgrade-fade">
      <div v-show="gameStore.phase === 'upgrading'" class="overlay upgrade-overlay">
        <div class="upgrade-panel">
          <div class="upgrade-header">
            <div class="ornament purple-ornament">⬡ ────────── ⬡</div>
            <h2 class="upgrade-title">BENDICIÓN CORRUPTA</h2>
            <div class="ornament purple-ornament">⬡ ────────── ⬡</div>
            <p class="upgrade-subtitle">NIVEL {{ playerStore.level }} — ELIGE TU BENDICIÓN</p>
          </div>

          <div class="cards-row">
            <div
              v-for="card in upgradeCards"
              :key="card.id"
              class="upgrade-card"
              :class="{ selected: selectedUpgrade === card.id }"
              @click="selectedUpgrade = card.id"
            >
              <div class="card-frame">
                <div class="card-icon">{{ card.icon }}</div>
                <div class="card-glow" v-if="selectedUpgrade === card.id" />
              </div>
              <div class="card-name">{{ card.name }}</div>
              <div class="card-stat">{{ card.statLabel }}</div>
              <div class="card-desc">{{ card.desc }}</div>
            </div>
          </div>

          <button class="btn primary large" :disabled="!selectedUpgrade" @click="confirmUpgrade">
            CONFIRMAR SELECCIÓN
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import GameCanvas from '@/components/game/GameCanvas.vue'

const gameStore   = useGameStore()
const playerStore = usePlayerStore()

// ── Mejoras ───────────────────────────────────────────────
const selectedUpgrade = ref(null)

const ALL_UPGRADES = [
  { id: 'damage',      name: 'FURIA DE ARES',        icon: '⚔️',  statLabel: 'DAÑO +15%',            desc: 'La ira del dios de la guerra fluye por tu hoja. Cada golpe perfora más profundo.' },
  { id: 'speed',       name: 'ZANCADA DE HERMES',    icon: '🏃🏻‍♂️',  statLabel: 'VELOCIDAD +10%',        desc: 'Las alas del mensajero divino bendicen tus pies. Te mueves como el viento.' },
  { id: 'maxHp',       name: 'RESISTENCIA DE HADES', icon: '🛡️',  statLabel: 'VIDA MÁXIMA +20%',     desc: 'La resiliencia del señor del inframundo refuerza tu cuerpo.' },
  { id: 'healHp',      name: 'GRACIA DE ASCLEPIO',   icon: '✨',  statLabel: 'RECUPERAR 30% VIDA',   desc: 'El toque del dios de la medicina sella tus heridas al instante.' },
  { id: 'damageSpeed', name: 'DUALIDAD DE APOLO',    icon: '🌟',  statLabel: 'DAÑO +8%  VEL +5%',   desc: 'El dios del sol combina sus dones: más rápido y más letal.' },
]

const upgradeCards = computed(() => {
  const seed = playerStore.level
  const shuffled = [...ALL_UPGRADES].sort((a, b) => Math.sin(seed * 9999 + ALL_UPGRADES.indexOf(a)) - 0.3)
  const picked = []; const used = new Set(); let i = 0
  while (picked.length < 3 && i < shuffled.length) {
    if (!used.has(shuffled[i].id)) { used.add(shuffled[i].id); picked.push(shuffled[i]) }
    i++
  }
  return picked
})

function confirmUpgrade() {
  if (!selectedUpgrade.value) return
  playerStore.applyUpgrade(selectedUpgrade.value)
  selectedUpgrade.value = null
  gameStore.closeUpgrade()
}

function handleMenu()    { gameStore.goToMenu() }
function handleRestart() {
  gameStore.goToMenu()
  setTimeout(() => gameStore.startGame(), 50)
}
</script>

<style scoped>
.game-view { position: relative; width: 100vw; height: 100vh; }

/* ── Overlay base ── */
.overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 50;
  background: rgba(0,0,0,0.62); backdrop-filter: blur(4px);
}
.transition-overlay { background: rgba(0,8,4,0.80); }
.upgrade-overlay   { background: rgba(4,2,14,0.88); backdrop-filter: blur(6px); }

/* ── Panel base ── */
.panel {
  display: flex; flex-direction: column; align-items: center; gap: 18px;
  padding: 40px 60px;
  background: linear-gradient(160deg, #1e1008 0%, #100a02 100%);
  border: 2px solid var(--color-gold);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.6), 0 0 40px rgba(201,147,58,0.25);
  clip-path: polygon(16px 0%,calc(100% - 16px) 0%,100% 16px,100% calc(100% - 16px),calc(100% - 16px) 100%,16px 100%,0% calc(100% - 16px),0% 16px);
  min-width: 340px;
}

.transition-panel {
  border-color: #22cc66;
  background: linear-gradient(160deg, #081e10 0%, #040e08 100%);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.6), 0 0 60px rgba(30,200,80,0.25);
  min-width: 400px;
}

/* ── Ornaments & titles ── */
.ornament       { font-size: 9px; color: var(--color-gold); letter-spacing: 2px; opacity: .7; }
.gold-ornament  { color: #44ffaa; }
.purple-ornament { color: #9966cc; }

.panel-title { font-family: var(--font-pixel); font-size: 20px; color: var(--color-gold); letter-spacing: 8px; text-shadow: 0 0 20px rgba(201,147,58,0.7); }
.gold-title  { color: #44ffaa; letter-spacing: 4px; text-shadow: 0 0 24px rgba(40,220,100,0.7); }

/* ── Botones Originales ── */
.panel-nav { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.btn {
  font-family: var(--font-pixel); font-size: 10px; letter-spacing: 2px;
  color: var(--color-text);
  background: rgba(255,255,255,0.04); border: 1px solid rgba(201,147,58,0.5);
  padding: 13px 28px; cursor: pointer; transition: all .18s; text-align: center;
}
.btn:hover { background: rgba(201,147,58,0.12); color: var(--color-gold); border-color: var(--color-gold); transform: translateY(-1px); }
.btn.primary { border-color: var(--color-fire); color: #fff; background: rgba(224,90,26,0.12); font-size: 11px; }
.btn.primary:hover { background: rgba(224,90,26,0.25); color: #ffa070; border-color: #ff7040; }
.btn.large { padding: 16px 40px; font-size: 12px; }
.btn:disabled { opacity: .35; cursor: not-allowed; }

/* ── ESTILOS GAME OVER HADES ── */
.gameover-hades-overlay {
  background: radial-gradient(circle at center 70%, rgba(120, 10, 10, 0.45) 0%, rgba(5, 2, 2, 0.95) 80%);
}

.gameover-hades-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90%;
  max-width: 950px;
  height: 80vh; 
  padding: 20px;
}

.gameover-header {
  text-align: center;
  margin-top: 40px;
}

.death-title {
  font-family: var(--font-pixel, 'Impact', sans-serif);
  font-size: 42px;
  color: #ff2222;
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 0 5px 15px rgba(200, 0, 0, 0.6), 2px 2px 0px #440000;
}

.death-subtitle {
  font-family: var(--font-pixel, monospace);
  font-size: 18px;
  color: #aa3333;
  margin: 10px 0 0 0;
  letter-spacing: 8px;
  text-shadow: 2px 2px 0px #000;
}

.gameover-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 20px;
}

.stats-and-progress {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 480px;
}

.stats-panel-hades {
  background: rgba(25, 25, 30, 0.95);
  border: 4px solid #3c3c44;
  border-radius: 6px;
  padding: 15px 25px;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.7);
}

.stat-row-hades {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 2px solid #2a2a32;
}

.stat-row-hades:last-child {
  border-bottom: none;
}

.stat-label-hades {
  color: #dcdcdc;
  font-family: var(--font-pixel, monospace);
  font-size: 11px;
}

.stat-val-hades {
  color: #ffcc44;
  font-family: var(--font-pixel, monospace);
  font-size: 14px;
  text-shadow: 0 0 10px rgba(255, 204, 68, 0.4);
}

.actions-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 250px;
}

.hades-btn {
  font-family: var(--font-pixel, monospace);
  font-size: 14px;
  padding: 18px 20px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.1s, filter 0.2s;
  border-radius: 6px;
}

.hades-btn:active {
  transform: scale(0.96);
}

.primary-hades {
  background: linear-gradient(180deg, #501515, #300505);
  border: 4px solid #ffcc44;
  color: #ffcc44;
  box-shadow: 0 0 15px rgba(255, 204, 68, 0.3), inset 0 0 10px rgba(255, 204, 68, 0.2);
}

.primary-hades:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 25px rgba(255, 204, 68, 0.5), inset 0 0 15px rgba(255, 204, 68, 0.4);
}

.secondary-hades {
  background: linear-gradient(180deg, #303038, #15151a);
  border: 4px solid #5a5a64;
  color: #e0e0e0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.secondary-hades:hover {
  filter: brightness(1.2);
  border-color: #7a7a84;
}

/* ── Panel original stats ── */
.panel-stats { font-size: 7px; color: rgba(232,217,192,0.4); display: flex; gap: 10px; }
.sep { opacity: .4; }

/* ── Upgrade panel ── */
.upgrade-panel {
  display: flex; flex-direction: column; align-items: center; gap: 24px;
  padding: 32px 44px 36px; width: min(900px, 96vw);
  background: linear-gradient(180deg, #0d0820 0%, #060414 100%);
  border: 2px solid #5a3a9a;
  box-shadow: 0 0 0 1px #2a1a4a, 0 0 60px rgba(120,60,255,0.25);
  clip-path: polygon(12px 0%,calc(100% - 12px) 0%,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0% calc(100% - 12px),0% 12px);
}
.upgrade-header { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.upgrade-title { font-family: var(--font-pixel); font-size: 18px; color: #c8a0ff; letter-spacing: 7px; text-shadow: 0 0 24px rgba(160,80,255,0.7); }
.upgrade-subtitle { font-family: var(--font-pixel); font-size: 7px; color: rgba(200,160,255,0.5); letter-spacing: 3px; }

.cards-row { display: flex; gap: 18px; justify-content: center; width: 100%; }

.upgrade-card {
  flex: 1; max-width: 210px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 18px 14px 20px;
  background: linear-gradient(180deg, #18102e 0%, #0e0820 100%);
  border: 2px solid #3a2060; cursor: pointer;
  transition: all .18s;
  clip-path: polygon(8px 0%,calc(100% - 8px) 0%,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0% calc(100% - 8px),0% 8px);
  position: relative;
}
.upgrade-card:hover { border-color: #8855cc; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(120,60,255,0.3); }
.upgrade-card.selected { border-color: #e8b040; background: linear-gradient(180deg, #2a1c08 0%, #1a1004 100%); transform: translateY(-6px); box-shadow: 0 0 0 1px #8a6020, 0 8px 32px rgba(230,160,40,0.4); }
.upgrade-card.selected::before { content: ''; position: absolute; inset: -2px; background: linear-gradient(135deg, #ffcc44, #ff8800, #ffcc44); z-index: -1; border-radius: 2px; animation: border-glow 1.5s linear infinite; background-size: 200% 200%; }
@keyframes border-glow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

.card-frame { width: 72px; height: 72px; background: linear-gradient(135deg, #1a1030 0%, #0c0820 100%); border: 2px solid #3a2a60; display: flex; align-items: center; justify-content: center; position: relative; clip-path: polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px); }
.upgrade-card.selected .card-frame { border-color: #cc9922; }
.card-icon { font-size: 32px; line-height: 1; }
.card-glow { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(230,160,40,0.15) 0%, transparent 70%); animation: pulse-glow 1.2s ease-in-out infinite alternate; }
@keyframes pulse-glow { from { opacity: .6; } to { opacity: 1; } }

.card-name { font-family: var(--font-pixel); font-size: 8px; color: #e0d0ff; letter-spacing: 1px; text-align: center; line-height: 1.5; }
.upgrade-card.selected .card-name { color: #ffdd88; }
.card-stat { font-family: var(--font-pixel); font-size: 7px; color: #88ff88; letter-spacing: 1px; text-align: center; }
.upgrade-card.selected .card-stat { color: #ffcc44; }
.card-desc { font-family: var(--font-pixel); font-size: 6px; color: rgba(200,180,255,0.5); text-align: center; line-height: 1.8; }

/* ── Transitions ── */
.overlay-fade-enter-active { transition: opacity .2s ease, transform .2s ease; }
.overlay-fade-leave-active { transition: opacity .15s ease, transform .15s ease; }
.overlay-fade-enter-from   { opacity: 0; transform: scale(.97); }
.overlay-fade-leave-to     { opacity: 0; transform: scale(.97); }
.upgrade-fade-enter-active { transition: opacity .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1); }
.upgrade-fade-leave-active { transition: opacity .2s ease, transform .2s ease; }
.upgrade-fade-enter-from   { opacity: 0; transform: scale(.92) translateY(20px); }
.upgrade-fade-leave-to     { opacity: 0; transform: scale(.95); }

.victory-overlay { background: rgba(0,6,0,0.88); }
.victory-panel {
  border-color: #ffcc00;
  background: linear-gradient(160deg, #1a1400 0%, #0a0c00 100%);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.6), 0 0 80px rgba(255,200,0,0.3);
}
.victory-title { color: #ffcc00; letter-spacing: 8px; text-shadow: 0 0 30px rgba(255,200,0,0.9); }
.victory-sub { font-family: var(--font-pixel); font-size: 8px; color: rgba(255,200,100,0.6); letter-spacing: 2px; }
.stat-val.gold { color: #ffcc44; }
</style>