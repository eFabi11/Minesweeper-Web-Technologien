<template>
  <div class="mode-selection">
    <button @click="selectMode('single')">Single Player</button>
    <button @click="selectMode('coop')">Cooperative</button>
    <button @click="selectMode('versus')">Versus</button>
  </div>
</template>

<script>
export default {
  methods: {
    selectMode(mode) {
      if (mode === 'single') {
        $('#singleMode').click(); // Löst den bestehenden Event-Listener aus
      } else if (mode === 'coop') {
        $('#coopMode').click(); // Löst den bestehenden Event-Listener aus
      } else if (mode === 'versus') {
        $('#vsMode').click(); // Löst den bestehenden Event-Listener aus
      }
    },
  },
};
</script>

<style scoped>
.mode-selection button {
  margin: 5px;
}
</style>
