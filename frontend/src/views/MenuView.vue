<template>
  <div class="menu-screen">

    <div class="menu-bg" aria-hidden="true">
      <div class="bg-crack c1" />
      <div class="bg-crack c2" />
      <div class="bg-crack c3" />
      <div class="bg-vignette" />
    </div>

    <header class="menu-header">
      <h1 class="title-line demon">DEMON</h1>
      <h1 class="title-line threshold">THRESHOLD</h1>
      <p class="title-subtitle">☠ &nbsp; LITE &nbsp; ☠</p>
    </header>

    <nav class="menu-nav" v-if="!authStore.token">
      <h2 class="auth-title">{{ isLoginMode ? 'INICIAR SESIÓN' : 'REGISTRARSE' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <input type="text" v-model="username" placeholder="Usuario" class="menu-input" required />
        
        <input v-if="!isLoginMode" type="email" v-model="email" placeholder="Correo electrónico" class="menu-input" required />
        
        <input type="password" v-model="password" placeholder="Contraseña" class="menu-input" required />
        
        <button type="submit" class="menu-btn primary form-btn">
          <span class="fire-icon">🔥</span>
          {{ isLoginMode ? 'ENTRAR' : 'CREAR CUENTA' }}
          <span class="fire-icon">🔥</span>
        </button>
      </form>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <button class="menu-btn secondary" @click="toggleMode">
        {{ isLoginMode ? '¿NUEVO AQUÍ? REGÍSTRATE' : '¿YA TIENES CUENTA? INICIA SESIÓN' }}
      </button>
    </nav>

    <nav class="menu-nav" v-else-if="!showClassSelect">
      <div class="user-profile" v-if="authStore.user">
        <img :src="authStore.user.avatarUrl" alt="Avatar Pixel Art" class="user-avatar" />
        <p class="welcome-msg">¡Bienvenido, {{ authStore.user.username }}!</p>
      </div>
      <p class="welcome-msg" v-else>¡Bienvenido, guerrero!</p>
      
      <button class="menu-btn primary" @click="openClassSelect">
        <span class="fire-icon">🔥</span>
        JUGAR
        <span class="fire-icon">🔥</span>
      </button>

      <button class="menu-btn" @click="toggleLeaderboard">
        TABLA DE CLASIFICACIÓN
      </button>

      <button class="menu-btn" @click="toggleCredits">
        CRÉDITOS
      </button>
      
      <button class="menu-btn secondary" @click="handleLogout">
        CERRAR SESIÓN
      </button>

      <transition name="slide-down">
        <div v-if="showLeaderboard" class="leaderboard-container">
          <Leaderboard />
        </div>
      </transition>

      <transition name="slide-down">
        <div v-if="showCredits" class="credits-box">
          <p>Proyecto USS</p>
          <p>Manuel Figueroa</p>
          <p>Diego Vargas</p>
        </div>
      </transition>
    </nav>

    <!-- ── Selección de clase ─────────────────────────────────── -->
    <nav class="menu-nav class-select" v-else>
      <h2 class="auth-title">ELIGE TU CLASE</h2>

      <div class="class-cards-row">
        <div
          v-for="cls in classOptions"
          :key="cls.id"
          class="class-card"
          :class="{ selected: pendingClass === cls.id }"
          @click="pendingClass = cls.id"
        >
          <div class="class-card-frame">
            <div class="class-card-icon">{{ cls.icon }}</div>
            <div class="class-card-glow" v-if="pendingClass === cls.id" />
          </div>
          <div class="class-card-name">{{ cls.label }}</div>
          <div class="class-card-stats">
            <span>❤️ {{ cls.base.maxHp }}</span>
            <span>⚔️ {{ cls.base.damage }}</span>
            <span>{{ cls.attack === 'staff' ? '🏹 rango' : '🗡️ melee' }}</span>
          </div>
          <div class="class-card-desc">{{ cls.desc }}</div>
        </div>
      </div>

      <button class="menu-btn primary" @click="confirmClassSelect">
        <span class="fire-icon">🔥</span>
        COMENZAR
        <span class="fire-icon">🔥</span>
      </button>

      <button class="menu-btn secondary" @click="closeClassSelect">
        ⬅ VOLVER
      </button>
    </nav>

    <footer class="menu-footer">
      <span>WASD — Mover</span>
      <span class="sep">·</span>
      <span>CLICK / ESPACIO — Atacar</span>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore }   from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useAuthStore }   from '@/stores/authStore' 
import { PLAYER_CLASSES, DEFAULT_CLASS } from '@/entities/playerConfig'
// Importamos el nuevo componente
import Leaderboard from '@/components/ui/Leaderboard.vue'

const gameStore   = useGameStore()
const playerStore = usePlayerStore()
const authStore   = useAuthStore()

const showCredits = ref(false)
const showLeaderboard = ref(false) // Estado reactivo para el ranking

// ── Selección de clase (Guerrero / Mago) ────────────────────
const showClassSelect = ref(false)
const pendingClass    = ref(DEFAULT_CLASS)
const classOptions    = Object.values(PLAYER_CLASSES)

function openClassSelect() {
  pendingClass.value = playerStore.characterClass || DEFAULT_CLASS
  showClassSelect.value = true
}

function closeClassSelect() {
  showClassSelect.value = false
}

function confirmClassSelect() {
  playerStore.reset(pendingClass.value)
  gameStore.startGame()
  showClassSelect.value = false
}

// Estados reactivos para controlar el login y registro
const username = ref('')
const email = ref('')
const password = ref('')
const isLoginMode = ref(true)
const errorMessage = ref('')

// Envío del formulario al store de Pinia
async function handleSubmit() {
  errorMessage.value = ''
  try {
    if (isLoginMode.value) {
      await authStore.login(username.value, password.value)
    } else {
      await authStore.register(username.value, email.value, password.value)
      // Cambiar de vista e informar al usuario
      isLoginMode.value = true
      errorMessage.value = '¡Registro exitoso! Ya puedes iniciar sesión.'
      // Limpiar inputs
      username.value = ''
      email.value = ''
      password.value = ''
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}

function toggleMode() {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
}

function handleLogout() {
  authStore.logout()
}

function toggleCredits() {
  showCredits.value = !showCredits.value
  if (showCredits.value) showLeaderboard.value = false // Cierra el ranking si abres créditos
}

// Función para alternar la visibilidad de la tabla
function toggleLeaderboard() {
  showLeaderboard.value = !showLeaderboard.value
  if (showLeaderboard.value) showCredits.value = false // Cierra los créditos si abres el ranking
}
</script>

<style scoped>
/* ── Estructura de Pantalla Completa ─────────────────────── */
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

/* ── Fondo Animado (Grietas de lava) ───────────────────── */
.menu-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-crack { position: absolute; inset: 0; }
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

/* ── Tipografía y Estilo de Títulos ─────────────────────── */
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

/* ── Contenedor de Botones y Formularios ─────────────────── */
.menu-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

/* Botones con estilo RPG / Recortados */
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
.menu-btn.secondary {
  font-size: 8px;
  padding: 10px 30px;
  min-width: 200px;
  border-color: var(--color-accent);
  background: rgba(10, 5, 20, 0.8);
  box-shadow: 0 0 10px rgba(123,47,255,0.2);
}
.menu-btn.secondary:hover {
  border-color: #9d5cff;
  box-shadow: 0 0 15px rgba(123,47,255,0.5);
  color: #fff;
}

/* Ícono de fuego animado */
.fire-icon {
  display: inline-block;
  font-size: 15px;
  animation: fireWiggle 0.45s ease-in-out infinite alternate;
}
@keyframes fireWiggle {
  from { transform: rotate(-6deg) scale(0.9); }
  to   { transform: rotate( 6deg) scale(1.1); }
}

/* ── Estructura y Estilos de Formulario de Autenticación ──── */
.auth-title {
  font-family: var(--font-pixel);
  font-size: 14px;
  color: var(--color-gold);
  margin-bottom: 15px;
  text-shadow: 2px 2px 0px #000;
  text-align: center;
}
.welcome-msg {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--color-text);
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px #000;
}
.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

/* Inputs adaptados a la estética del juego */
.menu-input {
  font-family: var(--font-pixel);
  font-size: 10px;
  padding: 14px;
  width: 290px;
  background: rgba(8, 8, 15, 0.85);
  border: 2px solid var(--color-accent);
  color: var(--color-text);
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  clip-path: polygon(
    5px 0%, calc(100% - 5px) 0%,
    100% 5px, 100% calc(100% - 5px),
    calc(100% - 5px) 100%, 5px 100%,
    0% calc(100% - 5px), 0% 5px
  );
}
.menu-input::placeholder { color: rgba(232,217,192,0.4); }
.menu-input:focus {
  border-color: var(--color-gold);
  background: rgba(20, 15, 5, 0.9);
  box-shadow: 0 0 15px rgba(201,147,58,0.3);
}
.form-btn { margin-top: 5px; }

/* Mensajes de error */
.error-msg {
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--color-danger);
  margin-top: 5px;
  text-shadow: 1px 1px 0px #000;
  max-width: 290px;
  text-align: center;
  line-height: 1.5;
}

/* ── Cuadro de Créditos y Leaderboard ────────────────────── */
.credits-box,
.leaderboard-container {
  background: rgba(0,0,0,0.85);
  border: 1px solid rgba(123,47,255,0.5);
  padding: 14px 28px;
  font-size: 8px;
  text-align: center;
  line-height: 2;
  color: rgba(232,217,192,0.8);
  width: 290px;
  box-shadow: 0 0 20px rgba(123,47,255,0.2);
}

.leaderboard-container {
  width: 350px; /* Un poco más ancho para acomodar la tabla */
  max-height: 300px;
  overflow-y: auto;
  border-color: var(--color-gold);
}

/* ── Pie de Página ──────────────────────────────────────── */
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
.sep { opacity: 0.5; }

/* ── Transiciones de CSS animadas ───────────────────────── */
.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-leave-active { transition: all 0.18s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-8px); }

/* ── Estilos para el Perfil (API DiceBear) ───────────────── */
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.user-avatar {
  width: 64px;
  height: 64px;
  background: rgba(10, 5, 20, 0.8);
  border: 2px solid var(--color-gold);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(201,147,58,0.4);
  image-rendering: pixelated;
}

/* ── Selección de clase (Guerrero / Mago) ────────────────── */
.class-select { gap: 18px; }

.class-cards-row {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.class-card {
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 14px 20px;
  background: linear-gradient(180deg, #18102e 0%, #0e0820 100%);
  border: 2px solid #3a2060;
  cursor: pointer;
  transition: all 0.18s ease;
  clip-path: polygon(
    8px 0%, calc(100% - 8px) 0%,
    100% 8px, 100% calc(100% - 8px),
    calc(100% - 8px) 100%, 8px 100%,
    0% calc(100% - 8px), 0% 8px
  );
  position: relative;
}
.class-card:hover {
  border-color: #8855cc;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(120,60,255,0.3);
}
.class-card.selected {
  border-color: var(--color-gold);
  background: linear-gradient(180deg, #2a1c08 0%, #1a1004 100%);
  transform: translateY(-6px);
  box-shadow: 0 0 0 1px #8a6020, 0 8px 32px rgba(230,160,40,0.4);
}

.class-card-frame {
  width: 64px; height: 64px;
  background: linear-gradient(135deg, #1a1030 0%, #0c0820 100%);
  border: 2px solid #3a2a60;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  clip-path: polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px);
}
.class-card.selected .class-card-frame { border-color: #cc9922; }
.class-card-icon { font-size: 28px; line-height: 1; }
.class-card-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(230,160,40,0.15) 0%, transparent 70%);
  animation: pulse-glow 1.2s ease-in-out infinite alternate;
}
@keyframes pulse-glow { from { opacity: .6; } to { opacity: 1; } }

.class-card-name {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: #e0d0ff;
  letter-spacing: 1px;
  text-align: center;
}
.class-card.selected .class-card-name { color: #ffdd88; }

.class-card-stats {
  display: flex;
  gap: 8px;
  font-size: 7px;
  color: rgba(232,217,192,0.8);
}

.class-card-desc {
  font-family: var(--font-pixel);
  font-size: 6px;
  color: rgba(200,180,255,0.55);
  text-align: center;
  line-height: 1.7;
}
.class-card.selected .class-card-desc { color: rgba(255,221,136,0.7); }

/* Scrollbar personalizado para el Leaderboard */
.leaderboard-container::-webkit-scrollbar {
  width: 6px;
}
.leaderboard-container::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.5);
}
.leaderboard-container::-webkit-scrollbar-thumb {
  background: var(--color-gold);
  border-radius: 3px;
}
</style>