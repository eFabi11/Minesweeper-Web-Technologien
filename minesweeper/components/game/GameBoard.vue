<template>
  <div class="game-board">
    <div v-for="(row, rowIndex) in boardData" :key="rowIndex" class="game-row">
      <GameCell
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :cell="cell"
        :x="rowIndex"
        :y="colIndex"
        :playerId="playerId"
      />
    </div>
  </div>
</template>

<script>
import GameCell from './GameCell.vue';

export default {
  components: { GameCell },
  props: {
    boardData: Array, // Erwartet die Struktur der bestehenden `buildGameBoardFromData`
    playerId: String,
  },
};
</script>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
}
.game-row {
  display: flex;
}
</style>
