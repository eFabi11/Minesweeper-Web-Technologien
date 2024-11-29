<template>
  <div :style="{ backgroundColor: '#f5f5f5' }">
    <Background />
    <Navbar />
    <div id="content">
      <Homepage
        v-if="currentScreen === 'home'"
        @start-game="startGame"
        @load-game="loadGame"
      />
      <GameScreen v-else-if="currentScreen === 'game'" :mode="selectedMode" />
      <LoadGameScreen v-else-if="currentScreen === 'loadGame'" />
    </div>
  </div>
</template>

<script>
import Background from './components/game/Background.vue';
import Navbar from './components/game/Navbar.vue';
import Homepage from './views/HomepageScreen.vue';
import GameScreen from './views/GameScreen.vue';
import LoadGameScreen from './views/LoadGameScreen.vue';

export default {
  components: {
    Background,
    Navbar,
    Homepage,
    GameScreen,
    LoadGameScreen,
  },
  data() {
    return {
      currentScreen: 'home', // Mögliche Werte: 'home', 'game', 'loadGame'
      selectedMode: null,
    };
  },
  methods: {
    startGame(mode) {
      this.selectedMode = mode;
      this.currentScreen = 'game';
    },
    loadGame() {
      this.currentScreen = 'loadGame';
    },
  },
};
</script>

<style scoped>
/* Main Content */
#content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding: 2vw;
  overflow: auto;
  font-family: 'Poppins', sans-serif;
}
</style>
