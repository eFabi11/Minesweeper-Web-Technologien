<template>
  <div :style="{ backgroundColor: '#f5f5f5' }">
    <Homepage v-if="!gameStarted" @start-game="startGame" />
    <Game v-else />
  </div>
</template>

<script>
import Homepage from './components/homepage/Homepage.vue';
import Game from './components/game/Game.vue';

export default {
  components: {
    Homepage,
    Game,
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