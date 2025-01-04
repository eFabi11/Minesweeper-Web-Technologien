<template>
  <div :style="{ backgroundColor: '#f5f5f5' }">
    <div id="content">
      <Homepage
        ref="homepage"
        v-if="currentScreen === 'home'"
        @start-game="startGame"
      />
      <GameScreen ref="GameScreen"
        v-else-if="currentScreen === 'game'"
        @load-game="loadGame"
        @return-to-home="returnToHome"
      />
      <LoadGameScreen
        v-else-if="currentScreen === 'loadGame'"
        @start-new-game="startNewGame"
        @load-existing-game="loadExistingGame"
      />
    </div>
  </div>
</template>

<script>
import Homepage from './views/HomepageScreen.vue';
import GameScreen from './views/GameScreen.vue';
import LoadGameScreen from './views/LoadGameScreen.vue';


export default {
  components: {
    Homepage,
    GameScreen,
    LoadGameScreen,
  },
  data() {
    return {
      currentScreen: 'home', // Mögliche Werte: 'home', 'game', 'loadGame',
    };
  },
  methods: {
    returnToHome() {
      this.currentScreen = 'home';
    },
    startGame(mode) {
      console.log("Gewählte Schwierigkeit:", mode); // Jetzt ist mode "benutzt"
      this.$refs.homepage.removeEventlisteners();
      this.currentScreen = 'game';
    },
    loadGame() {
      this.currentScreen = 'loadGame';
    },
    startNewGame() {
      this.currentScreen = 'game';
    },
    loadExistingGame() {
      this.currentScreen = 'game';
      this.$nextTick(() => {
        this.$refs.GameScreen.modeSelected = 'single'
        this.$refs.GameScreen.selectedDifficulty = 'M'
      })
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
  justify-content: center;
  overflow: auto;
  font-family: 'Poppins', sans-serif;
}
</style>
