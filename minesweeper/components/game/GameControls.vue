<template>
  <div id="controls">
    <button class="btn-custom mx-2" @click="undo">Undo</button>
    <button class="btn-custom mx-2" @click="restart">Restart</button>
    <button class="btn-custom mx-2" @click="saveGame">Save Game</button>
    <button class="btn-custom mx-2" @click="loadGame">Load Game</button>
  </div>
</template>

<script>
export default {
  methods: {
    undo() {
      this.$emit('undo'); // Event für "Undo" auslösen
    },
    restart() {
      this.$emit('restart'); // Event für "Restart" auslösen
    },
    saveGame() {
      this.$emit('save-game'); // Event für "Save Game" auslösen
    },
    loadGame() {
      this.$emit('load-game'); // Event für "Load Game" auslösen
    },
  },
};
</script>

<style scoped>
#controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn-custom {
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #6a7d91;
  border: none;
  color: white;
}

.btn-custom:hover,
.btn-custom:focus {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background-color: #7b8da1;
}
</style>
