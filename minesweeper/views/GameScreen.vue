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
        :mode="modeSelected"
        @selectedDifficulty="handleDifficultySelection"
      />

      <!-- Spielfeld -->
      <GameBoard
        ref="gameBoard"
        v-if="selectedDifficulty"
        :gameState="gameState"
        :mode="modeSelected"
        :coopBoardData="coopBoardData"
        @game-state-updated="handleGameStateUpdate"
        @send-coop-action="handleCoopAction"
      />

      <!-- Spielsteuerung -->
      <GameControls
        v-if="selectedDifficulty"
        :mode="modeSelected"
        @send-coop-control="handleCoopControl"
        @reset-difficulty="resetDifficulty"
        @load-game="handleLoadGame"
        @game-state-updated="handleGameStateUpdate"
      />
    </div>

    <Socket
      ref="socket"
      @build-coop-game-boards="buildCoopGameBoards"
    />

  </div>
</template>

<script>
import Background from '../components/game/Background.vue';
import Navbar from '../components/game/Navbar.vue';
import ModeSelection from '../components/game/ModeSelection.vue';
import DifficultySelection from '../components/game/DifficultySelection.vue';
import GameBoard from '../components/game/GameBoard.vue';
import GameControls from '../components/game/GameControls.vue';
import Socket from '../components/game/Socket.vue';

export default {
  components: {
    Background,
    Navbar,
    ModeSelection,
    DifficultySelection,
    GameBoard,
    GameControls,
    Socket,
  },
  data() {
    return {
      gameState: "Playing",
      modeSelected: null,
      selectedDifficulty: null,
      coopBoardData: "",
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

      if (mode === 'coop') {
        this.$refs.socket.connectCoopWebSocket();
      }
    },
    handleDifficultySelection(difficulty, mode) {
      switch (mode) {
        case 'coop':
          console.log("Setting difficulty level to:", difficulty);
          this.$refs.socket.sendCoopAction('setDifficulty', { level: difficulty});
          break;
        case 'versus':

          break;
      }
      this.selectedDifficulty = difficulty;
    },
    handleLoadGame() {
      this.$emit('load-game');
    },
    handleGameStateUpdate(newGameState) {
      this.gameState = newGameState;
      this.handleRebuildGameBoard();
    },
    buildCoopGameBoards(data) {
      this.coopBoardData = data;
      this.gameState = data.gameState;
      console.log("coopBoardData on GameScreen: ", this.coopBoardData.type);
      this.handleRebuildGameBoard();
    },
    async handleRebuildGameBoard() {
      this.$refs.gameBoard.buildGameBoard();
    },
    handleCoopAction(action, x, y) {
      this.$refs.socket.sendCoopAction(action, { x: x, y: y });
    },
    handleCoopControl(action) {
      this.$refs.socket.sendCoopAction(action, {});
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
