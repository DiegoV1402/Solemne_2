<template>
  <div class="leaderboard-box">
    <h3 class="leaderboard-title">RANKING DE GUERREROS</h3>

    <div v-if="isLoading" class="status-container loading">
      <span class="pulse-text">CARGANDO ALMAS...</span>
    </div>

    <div v-else-if="error" class="status-container error">
      <p class="error-text">❌ ERROR: {{ error }}</p>
      <button class="retry-btn" @click="fetchLeaderboard">REINTENTAR</button>
    </div>

    <div v-else-if="leaderboard.length > 0" class="table-wrapper">
      <table class="rpg-table">
        <thead>
          <tr>
            <th class="text-center">POS</th>
            <th>HÉROE</th>
            <th class="text-right">PUNTOS</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(player, index) in leaderboard" 
            :key="player.id || index"
            :class="{ 
              'top-1': index === 0, 
              'top-2': index === 1, 
              'top-3': index === 2 
            }"
          >
            <td class="text-center rank-col">
              <span v-if="index === 0">🥇</span>
              <span v-else-if="index === 1">🥈</span>
              <span v-else-if="index === 2">🥉</span>
              <span v-else>#{{ index + 1 }}</span>
            </td>
            <td class="username-col">{{ player.username || player.User?.username || 'Anónimo' }}</td>
            <td class="text-right score-col">{{ player.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="status-container empty">
      <p>EL ABISMO ESTÁ VACÍO...</p>
      <p class="subtitle">Sé el primero en reclamar la gloria.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const leaderboard = ref([])
const isLoading = ref(true)
const error = ref(null)

// Función para obtener los puntajes del servidor
async function fetchLeaderboard() {
  try {
    isLoading.value = true
    error.value = null

    const response = await fetch('http://localhost:3000/api/games/leaderboard')

    if (!response.ok) {
      throw new Error(`Código de respuesta: ${response.status}`)
    }

    const data = await response.json()
    
    // Si la API devuelve un arreglo directamente o envuelto en un objeto
    leaderboard.value = Array.isArray(data) ? data : (data.leaderboard || data.data || [])
    
  } catch (err) {
    console.error('Error al cargar ranking:', err)
    error.value = 'No se pudo conectar con el Reino.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLeaderboard()
})
</script>

<style scoped>
/* ── Contenedor General de la Tabla ─────────────────────── */
.leaderboard-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.leaderboard-title {
  font-family: var(--font-pixel);
  font-size: 11px;
  color: var(--color-gold);
  letter-spacing: 2px;
  text-shadow: 2px 2px 0px #000;
  margin-bottom: 4px;
}

.table-wrapper {
  width: 100%;
}

/* ── Diseño de la Tabla Estilo RPG ──────────────────────── */
.rpg-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-pixel);
  font-size: 9px;
  text-align: left;
}

.rpg-table th {
  color: rgba(232, 217, 192, 0.5);
  padding: 8px 6px;
  border-bottom: 2px solid rgba(123, 47, 255, 0.3);
  letter-spacing: 1px;
}

.rpg-table td {
  padding: 10px 6px;
  color: var(--color-text);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

/* Alineaciones */
.text-center { text-align: center; }
.text-right { text-align: right; }

.rank-col { width: 50px; }
.score-col { color: #fff; }

/* ── Destacar los Primeros Lugares (Efectos de Brillo) ─── */
.top-1 td {
  color: #ffc890;
  text-shadow: 0 0 8px var(--color-fire);
  font-size: 10px;
}
.top-2 td {
  color: #e8d9c0;
  text-shadow: 0 0 6px rgba(232, 217, 192, 0.6);
}
.top-3 td {
  color: #cd7f32;
  text-shadow: 0 0 4px rgba(205, 127, 50, 0.5);
}

/* ── Estados: Carga, Error, Vacío ──────────────────────── */
.status-container {
  padding: 20px 0;
  font-family: var(--font-pixel);
  font-size: 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pulse-text {
  color: rgba(123, 47, 255, 0.8);
  animation: textPulse 1.5s ease-in-out infinite alternate;
}

@keyframes textPulse {
  from { opacity: 0.4; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1.02); }
}

.error-text {
  color: var(--color-danger);
  text-shadow: 1px 1px 0px #000;
}

.retry-btn {
  font-family: var(--font-pixel);
  font-size: 8px;
  background: #140c00;
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.retry-btn:hover {
  background: var(--color-gold);
  color: #000;
}

.empty {
  color: rgba(232, 217, 192, 0.4);
}
.empty .subtitle {
  font-size: 7px;
  margin-top: 4px;
}
</style>