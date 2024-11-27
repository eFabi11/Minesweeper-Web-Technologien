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

    #gameBoard {
        display: flex;
        flex-direction: column;
        max-width: 75vw;
        max-height: 75vh;
        margin-top: 2%;
        margin-bottom: 2%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        padding: 1vw;
        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
        background-color: rgba(255, 255, 255, 0.2);
    }

</style>
