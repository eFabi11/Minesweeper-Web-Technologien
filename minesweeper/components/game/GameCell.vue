<template>
  <div 
    class="cell" 
    :class="[cell.state, playerId === cell.playerId ? 'own-cell' : '']"
    @click="uncoverCell(x, y)"
    @contextmenu.prevent="flagCell(x, y)"
  >
    <span v-html="cellContent"></span>
  </div>
</template>

<script>
export default {
  props: {
    cell: Object,
    x: Number,
    y: Number,
    playerId: String,
  },
  computed: {
    cellContent() {
      switch (this.cell.state) {
        case "bomb": return '<img src="/assets/Mine.png" alt="Mine">';
        case "flag": return '&#x1F6A9;';
        case "number": return this.cell.value;
        default: return '&nbsp;';
      }
    },
  },
};
</script>

<style scoped>
.cell {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
