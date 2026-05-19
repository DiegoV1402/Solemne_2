<template>
  <div class="game-view">
    <GameCanvas />

    <!-- ── PAUSA ── -->
    <transition name="overlay-fade">
      <div v-show="gameStore.isPaused" class="pause-overlay">
        <div class="pause-panel">
          <div class="pause-ornament top-ornament">✦ ─────── ✦</div>
          <h2 class="pause-title">PAUSA</h2>
          <div class="pause-ornament">✦ ─────── ✦</div>
          <nav class="pause-nav">
            <button class="pause-btn primary" @click="gameStore.togglePause">▶&nbsp; REANUDAR</button>
            <button class="pause-btn" @click="handleMenu">⬅&nbsp; MENÚ PRINCIPAL</button>
          </nav>
          <div class="pause-stats">
            <span>Nivel {{ playerStore.level }}</span>
            <span class="sep">·</span>
            <span>{{ gameStore.elapsedFormatted }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── GAME OVER ── -->
    <transition name="overlay-fade">
      <div v-show="gameStore.phase === 'gameover'" class="pause-overlay gameover-overlay">
        <div class="pause-panel gameover-panel">
          <div class="pause-ornament top-ornament">✦ ─────── ✦</div>
          <h2 class="pause-title gameover-title">GAME OVER</h2>
          <div class="pause-ornament">✦ ─────── ✦</div>
          <div class="gameover-stats">
            <div class="stat-row"><span class="stat-label">Tiempo</span><span class="stat-val">{{ gameStore.elapsedFormatted }}</span></div>
            <div class="stat-row"><span class="stat-label">Nivel</span><span class="stat-val">{{ playerStore.level }}</span></div>
            <div class="stat-row"><span class="stat-label">Enemigos</span><span class="stat-val">{{ gameStore.enemiesDefeated }}</span></div>
          </div>
          <nav class="pause-nav">
            <button class="pause-btn primary" @click="handleRestart">↺&nbsp; REINTENTAR</button>
            <button class="pause-btn" @click="handleMenu">⬅&nbsp; MENÚ PRINCIPAL</button>
          </nav>
        </div>
      </div>
    </transition>

    <!-- ── BENDICIÓN CORRUPTA (mejoras) ── -->
    <transition name="upgrade-fade">
      <div v-show="gameStore.phase === 'upgrading'" class="upgrade-overlay">
        <div class="upgrade-panel">

          <div class="upgrade-header">
            <div class="upgrade-ornament">⬡ ────────── ⬡</div>
            <h2 class="upgrade-title">BENDICIÓN CORRUPTA</h2>
            <div class="upgrade-ornament">⬡ ────────── ⬡</div>
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

          <button
            class="confirm-btn"
            :disabled="!selectedUpgrade"
            @click="confirmUpgrade"
          >
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

const selectedUpgrade = ref(null)

// Pool de mejoras — se eligen 3 aleatorias cada vez
const ALL_UPGRADES = [
  {
    id: 'damage',
    name: 'FURIA DE ARES',
    icon: '⚔️',
    statLabel: 'DAÑO +15%',
    desc: 'La ira del dios de la guerra fluye por tu hoja. Cada golpe perfora más profundo en la carne de tus enemigos.',
  },
  {
    id: 'speed',
    name: 'ZANCADA DE HERMES',
    icon: '🪶',
    statLabel: 'VELOCIDAD +10%',
    desc: 'Las alas del mensajero divino bendicen tus pies. Te mueves como el viento entre las sombras del umbral.',
  },
  {
    id: 'maxHp',
    name: 'RESISTENCIA DE HADES',
    icon: '🛡️',
    statLabel: 'VIDA MÁXIMA +20%',
    desc: 'La resiliencia del señor del inframundo refuerza tu cuerpo. Soportas lo que mataría a cualquier mortal.',
  },
  {
    id: 'healHp',
    name: 'GRACIA DE ASCLEPIO',
    icon: '✨',
    statLabel: 'RECUPERAR 30% VIDA',
    desc: 'El toque del dios de la medicina sella tus heridas. La corrupción retrocede ante su luz sanadora.',
  },
  {
    id: 'damageSpeed',
    name: 'DUALIDAD DE APOLO',
    icon: '🌟',
    statLabel: 'DAÑO +8%  VELOCIDAD +5%',
    desc: 'El dios del sol y la guerra combina sus dones. Eres más rápido y más letal al mismo tiempo.',
  },
]

// 3 cartas aleatorias sin repetir, recalculadas cuando abre el overlay
const upgradeCards = computed(() => {
  // Usar nivel como seed para que no cambien al re-renderizar
  const seed = playerStore.level
  const shuffled = [...ALL_UPGRADES].sort(() => Math.sin(seed * 9999 + ALL_UPGRADES.indexOf(ALL_UPGRADES[0])) - 0.3)
  // Siempre elegir índices distintos
  const picked = []
  const used   = new Set()
  let i = 0
  while (picked.length < 3 && i < shuffled.length) {
    if (!used.has(shuffled[i].id)) {
      used.add(shuffled[i].id)
      picked.push(shuffled[i])
    }
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

function handleMenu() {
  gameStore.goToMenu()
}

function handleRestart() {
  gameStore.goToMenu()
  setTimeout(() => { gameStore.startGame() }, 50)
}
</script>

<style scoped>
.game-view {
  position: relative;
  width: 100vw;
  height: 100vh;
}

/* ── Overlay base ───────────────────────────────────────── */
.pause-overlay,
.upgrade-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.pause-overlay    { background: rgba(0,0,0,0.60); backdrop-filter: blur(4px); }
.gameover-overlay { background: rgba(20,0,0,0.75); }
.upgrade-overlay  { background: rgba(4,2,14,0.88); backdrop-filter: blur(6px); }

/* ── Pause panel ────────────────────────────────────────── */
.pause-panel {
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  padding: 44px 64px;
  background: linear-gradient(160deg, #1e1008 0%, #100a02 100%);
  border: 2px solid var(--color-gold);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.6), 0 0 40px rgba(201,147,58,0.25);
  clip-path: polygon(16px 0%,calc(100% - 16px) 0%,100% 16px,100% calc(100% - 16px),calc(100% - 16px) 100%,16px 100%,0% calc(100% - 16px),0% 16px);
}

.gameover-panel {
  border-color: #cc2222;
  background: linear-gradient(160deg, #1e0808 0%, #0f0202 100%);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.6), 0 0 60px rgba(200,30,30,0.3);
}

.pause-ornament { font-size: 9px; color: var(--color-gold); letter-spacing: 2px; opacity: .7; }
.top-ornament   { margin-bottom: -8px; }

.pause-title {
  font-family: var(--font-pixel); font-size: 22px; color: var(--color-gold);
  letter-spacing: 10px;
  text-shadow: 0 0 20px rgba(201,147,58,0.7);
}
.gameover-title { color: #ff4444; letter-spacing: 6px; text-shadow: 0 0 20px rgba(255,50,50,0.8); }

.pause-nav { display: flex; flex-direction: column; gap: 12px; width: 100%; }

.pause-btn {
  font-family: var(--font-pixel); font-size: 11px; letter-spacing: 2px;
  color: var(--color-text);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(201,147,58,0.5);
  padding: 14px 32px; cursor: pointer;
  transition: all 0.18s ease; text-align: center;
}
.pause-btn:hover { background: rgba(201,147,58,0.12); color: var(--color-gold); border-color: var(--color-gold); transform: translateY(-1px); }
.pause-btn.primary { border-color: var(--color-fire); color: #fff; background: rgba(224,90,26,0.12); font-size: 12px; }
.pause-btn.primary:hover { background: rgba(224,90,26,0.25); color: #ffa070; border-color: #ff7040; }

.gameover-stats { display:flex; flex-direction:column; gap:8px; width:100%; background:rgba(0,0,0,0.3); padding:16px 24px; border:1px solid rgba(255,50,50,0.2); }
.stat-row { display:flex; justify-content:space-between; font-size:9px; }
.stat-label { color:rgba(232,217,192,0.5); }
.stat-val   { color:#ff8888; }
.pause-stats { font-size:8px; color:rgba(232,217,192,0.4); display:flex; gap:10px; }
.sep { opacity:.4; }

/* ── Upgrade panel ──────────────────────────────────────── */
.upgrade-panel {
  display: flex; flex-direction: column; align-items: center; gap: 28px;
  padding: 36px 48px 40px;
  width: min(900px, 96vw);
  background: linear-gradient(180deg, #0d0820 0%, #060414 100%);
  border: 2px solid #5a3a9a;
  box-shadow: 0 0 0 1px #2a1a4a, 0 0 60px rgba(120,60,255,0.25), inset 0 1px 0 rgba(255,255,255,0.04);
  clip-path: polygon(12px 0%,calc(100% - 12px) 0%,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0% calc(100% - 12px),0% 12px);
}

.upgrade-header { display:flex; flex-direction:column; align-items:center; gap:8px; }

.upgrade-ornament { font-size: 10px; color: #9966cc; letter-spacing: 3px; opacity: .7; }

.upgrade-title {
  font-family: var(--font-pixel); font-size: 20px; color: #c8a0ff;
  letter-spacing: 8px;
  text-shadow: 0 0 24px rgba(160,80,255,0.7), 0 0 60px rgba(120,50,200,0.3);
}

.upgrade-subtitle {
  font-family: var(--font-pixel); font-size: 7px; color: rgba(200,160,255,0.5);
  letter-spacing: 3px; margin-top: 2px;
}

/* ── Cards row ──────────────────────────────────────────── */
.cards-row {
  display: flex; gap: 20px; justify-content: center; width: 100%;
}

.upgrade-card {
  flex: 1; max-width: 220px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 20px 16px 22px;
  background: linear-gradient(180deg, #18102e 0%, #0e0820 100%);
  border: 2px solid #3a2060;
  cursor: pointer;
  transition: all 0.18s ease;
  clip-path: polygon(8px 0%,calc(100% - 8px) 0%,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0% calc(100% - 8px),0% 8px);
  position: relative;
}

.upgrade-card:hover {
  border-color: #8855cc;
  background: linear-gradient(180deg, #22163a 0%, #140c28 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(120,60,255,0.3);
}

.upgrade-card.selected {
  border-color: #e8b040;
  background: linear-gradient(180deg, #2a1c08 0%, #1a1004 100%);
  transform: translateY(-6px);
  box-shadow: 0 0 0 1px #8a6020, 0 8px 32px rgba(230,160,40,0.4), 0 0 60px rgba(200,130,20,0.2);
}

/* Animated glow border for selected */
.upgrade-card.selected::before {
  content: '';
  position: absolute; inset: -2px;
  background: linear-gradient(135deg, #ffcc44, #ff8800, #ffcc44);
  z-index: -1;
  border-radius: 2px;
  animation: border-glow 1.5s linear infinite;
  background-size: 200% 200%;
}

@keyframes border-glow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card-frame {
  width: 80px; height: 80px;
  background: linear-gradient(135deg, #1a1030 0%, #0c0820 100%);
  border: 2px solid #3a2a60;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  clip-path: polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px);
}

.upgrade-card.selected .card-frame { border-color: #cc9922; }

.card-icon { font-size: 36px; line-height: 1; }

.card-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(230,160,40,0.15) 0%, transparent 70%);
  animation: pulse-glow 1.2s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  from { opacity: .6; }
  to   { opacity: 1; }
}

.card-name {
  font-family: var(--font-pixel); font-size: 9px; color: #e0d0ff;
  letter-spacing: 2px; text-align: center; line-height: 1.5;
}

.upgrade-card.selected .card-name { color: #ffdd88; }

.card-stat {
  font-family: var(--font-pixel); font-size: 8px; color: #88ff88;
  letter-spacing: 1px; text-align: center;
}

.upgrade-card.selected .card-stat { color: #ffcc44; }

.card-desc {
  font-family: var(--font-pixel); font-size: 6px; color: rgba(200,180,255,0.5);
  text-align: center; line-height: 1.8; letter-spacing: 0.5px;
}

/* ── Confirm button ─────────────────────────────────────── */
.confirm-btn {
  font-family: var(--font-pixel); font-size: 11px; letter-spacing: 3px;
  color: #fff;
  background: linear-gradient(135deg, #3a1a70, #5a2a9a);
  border: 2px solid #9966cc;
  padding: 16px 60px;
  cursor: pointer;
  transition: all 0.2s ease;
  clip-path: polygon(8px 0%,calc(100% - 8px) 0%,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0% calc(100% - 8px),0% 8px);
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a2a9a, #7a3acc);
  border-color: #cc99ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(120,60,255,0.4);
}

.confirm-btn:disabled {
  opacity: .35; cursor: not-allowed;
}

/* ── Transitions ────────────────────────────────────────── */
.overlay-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.overlay-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.overlay-fade-enter-from   { opacity: 0; transform: scale(0.97); }
.overlay-fade-leave-to     { opacity: 0; transform: scale(0.97); }

.upgrade-fade-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.upgrade-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.upgrade-fade-enter-from   { opacity: 0; transform: scale(0.92) translateY(20px); }
.upgrade-fade-leave-to     { opacity: 0; transform: scale(0.95); }
</style>
