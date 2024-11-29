<template>
  <div :style="{ backgroundColor: '#f5f5f5' }">
    <Homepage v-if="!gameStarted" @start-game="startGame" />
    <Game v-else />
    <!-- <LoadGame v-else /> -->
  </div>
</template>

<script>
import Homepage from './views/Homepage.vue';
import Game from './views/Game.vue';
/* import LoadGame from './views/LoadGame.vue'; */

export default {
  components: {
    Homepage,
    Game,
    /* LoadGame */
  },
  data() {
    return {
      gameStarted: false,
    };
  },
  methods: {
    startGame() {
      this.gameStarted = true;
    },
  },
};
</script>