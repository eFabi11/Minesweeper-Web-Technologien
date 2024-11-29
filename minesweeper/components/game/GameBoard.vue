<template>
  <div class="game-board">
    <!-- Spielfeld wird hier generiert -->
    <div v-for="(row, rowIndex) in cells" :key="rowIndex" class="game-row">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :class="['cell', cell.state]"
        @click="handleCellClick(rowIndex, colIndex)"
        @contextmenu.prevent="handleRightClick(rowIndex, colIndex)"
      >
        <span class="cell-content">
          <!-- Zeige den Inhalt des Feldes basierend auf seinem Zustand -->
          <template v-if="cell.state === 'bomb'">💣</template>
          <template v-else-if="cell.state === 'flag'">🚩</template>
          <template v-else-if="cell.state === 'number'">{{ cell.value }}</template>
          <template v-else>&nbsp;</template>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameBoard",
  props: {
    cells: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleCellClick(row, col) {
      this.$emit("cellClick", { row, col });
    },
    handleRightClick(row, col) {
      this.$emit("cellFlag", { row, col });
    },
  },
};
</script>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.game-row {
  display: flex;
  gap: 0.5rem;
}

.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cell.covered {
  background-color: #ccc;
}

.cell.revealed {
  background-color: #e0e0e0;
}

.cell.bomb {
  background-color: #f00;
}

.cell.flag {
  background-color: #ff0;
}

.cell-content {
  font-size: 1.2rem;
}
</style>
