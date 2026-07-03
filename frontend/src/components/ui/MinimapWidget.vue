<template>
  <div class="mm-wrap">
    <div class="mm-label">MAPA</div>
    <div class="mm-grid">
      <template v-for="room in rooms" :key="room.id">
        <!-- Celda de sala -->
        <div
          v-if="room.visible"
          class="mm-cell"
          :class="{
            current:   room.id === gameStore.currentRoomId,
            cleared:   room.cleared,
            uncleared: !room.cleared && room.type !== 'boss',
            boss:      room.type === 'boss',
            archer:    room.bossType === 'archer',
            start:     room.type === 'start',
          }"
          :style="{ gridColumn: room.col, gridRow: room.row }"
        >
          <template v-if="room.type === 'boss'">{{ room.bossType === 'archer' ? '🏹' : '☠' }}</template>
          <template v-else-if="room.cleared">✓</template>
          <template v-else-if="room.type === 'start'">S</template>
        </div>

        <!-- Celda vacía (sala no descubierta) -->
        <div
          v-else
          class="mm-cell hidden"
          :style="{ gridColumn: room.col, gridRow: room.row }"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { DUNGEON_MAP }  from '@/game/data/dungeonMap'

const gameStore = useGameStore()

// Posiciones de cada sala en la cuadrícula 9×3
// Layout:  Row1=[5]        [12]
//          Row2=[S][1][2][4][Boss][8][9][11][Boss2]
//          Row3=  [3][6]        [10][13]
const POS = {
  0:  { col: 1, row: 2 },
  1:  { col: 2, row: 2 },
  2:  { col: 3, row: 2 },
  3:  { col: 2, row: 3 },
  4:  { col: 4, row: 2 },
  5:  { col: 3, row: 1 },
  6:  { col: 3, row: 3 },
  7:  { col: 5, row: 2 },
  8:  { col: 6, row: 2 },
  9:  { col: 7, row: 2 },
  10: { col: 6, row: 3 },
  11: { col: 8, row: 2 },
  12: { col: 7, row: 1 },
  13: { col: 7, row: 3 },
  14: { col: 9, row: 2 },
}

const rooms = computed(() => {
  const curId   = gameStore.currentRoomId
  const curRoom = gameStore.dungeonRooms[curId] ?? DUNGEON_MAP.rooms[curId]
  const adjacent = Object.values(curRoom?.connections ?? {})

  return Object.values(DUNGEON_MAP.rooms).map(r => {
    const state   = gameStore.dungeonRooms[r.id] ?? r
    return {
      id:       r.id,
      type:     r.type,
      bossType: r.bossType,
      cleared:  !!state.cleared,
      visited:  !!state.visited,
      visible:  state.visited || adjacent.includes(r.id) || r.id === curId,
      col:      POS[r.id]?.col ?? 1,
      row:      POS[r.id]?.row ?? 1,
    }
  })
})
</script>

<style scoped>
.mm-wrap {
  background: rgba(0, 0, 0, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 5px;
  padding: 8px 10px 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.7);
}

.mm-label {
  font-family: 'Press Start 2P', monospace;
  font-size: 5px;
  color: rgba(232, 217, 192, 0.4);
  letter-spacing: 2px;
}

.mm-grid {
  display: grid;
  grid-template-columns: repeat(9, 20px);
  grid-template-rows:    repeat(3, 14px);
  gap: 3px;
}

.mm-cell {
  width: 20px;
  height: 14px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Press Start 2P', monospace;
  font-size: 6px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.mm-cell.hidden    { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
.mm-cell.start     { background: #1a3a1a; border-color: #336633; color: #66ff88; }
.mm-cell.uncleared { background: #3a1010; border-color: #663322; }
.mm-cell.cleared   { background: #0d2a0d; border-color: #1a5a22; color: #44cc66; }
.mm-cell.boss      {
  background: #3a0e00;
  border-color: #bb3300;
  color: #ff6622;
  animation: bossPulse 1.1s ease-in-out infinite alternate;
}
.mm-cell.archer    {
  background: #0e2a12;
  border-color: #33cc55;
  color: #66ff88;
  animation: archerPulse 1.1s ease-in-out infinite alternate;
}

@keyframes archerPulse {
  from { border-color: #33cc55; }
  to   { border-color: #66ff88; box-shadow: 0 0 5px rgba(100,255,140,0.5); }
}
.mm-cell.current {
  border-color: #ffffff !important;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.55);
  transform: scale(1.2);
  z-index: 1;
}

@keyframes bossPulse {
  from { border-color: #bb3300; }
  to   { border-color: #ff6600; box-shadow: 0 0 5px rgba(255,100,0,0.5); }
}
</style>
