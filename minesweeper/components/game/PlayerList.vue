<template>
  <div class="player-list">
    <div v-for="player in players" :key="player" class="player">
      {{ player }}
    </div>
    <div class="player-count">Players: {{ players.length }}/4</div>
  </div>
</template>

<script>
export default {
  props: {
    players: Array, // Nutzt das bestehende `players`-Array
  },
};
</script>

<style scoped>
.player-list {
  margin: 10px;
}
</style>
