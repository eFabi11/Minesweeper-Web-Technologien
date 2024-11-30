<template>
  <div>
    <Background />
    <Navbar
      @return-to-Home="returnToHome"
    />

    <div id="content" class="game">
      <!-- Modusauswahl -->
      <ModeSelection v-if="!modeSelected" @modeSelected="handleModeSelection" />

      <!-- Schwierigkeitsauswahl -->
      <DifficultySelection
        v-if="modeSelected && !selectedDifficulty"
        @selectedDifficulty="handleDifficultySelection"
      />

      <!-- Spielfeld -->
      <GameBoard
        ref="gameBoard"
        v-if="selectedDifficulty"
        :gameState="gameState"
        @game-state-updated="handleGameStateUpdate"
      />

      <!-- Spielsteuerung -->
      <GameControls
        v-if="selectedDifficulty"
        @reset-difficulty="resetDifficulty"
        @load-game="handleLoadGame"
        @game-state-updated="handleGameStateUpdate"
      />
    </div>
  </div>
</template>

<script>
import Background from '../components/game/Background.vue';
import Navbar from '../components/game/Navbar.vue';
import ModeSelection from '../components/game/ModeSelection.vue';
import DifficultySelection from '../components/game/DifficultySelection.vue';
import GameBoard from '../components/game/GameBoard.vue';
import GameControls from '../components/game/GameControls.vue';

export default {
  components: {
    Background,
    Navbar,
    ModeSelection,
    DifficultySelection,
    GameBoard,
    GameControls,
  },
  data() {
    return {
      gameState: "Playing",
      modeSelected: null,
      selectedDifficulty: null,
    };
  },
  methods: {
    resetDifficulty() {
      this.selectedDifficulty = null;
    },
    returnToHome() {
      this.$emit('return-to-home');
    },
    handleModeSelection(mode) {
      this.modeSelected = mode;
    },
    handleDifficultySelection(difficulty) {
      this.selectedDifficulty = difficulty;
    },
    handleLoadGame() {
      this.$emit('load-game');
    },
    async handleGameStateUpdate(newGameState) {
      this.gameState = newGameState;
      this.$refs.gameBoard.buildGameBoard();
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
  width: 100vw;
  height: 100vh;
  padding: 2vw;
  box-sizing: border-box;
  overflow: auto;
  color: white;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  font-family: 'Poppins', sans-serif;
  margin-top: 5%;
}
</style>
