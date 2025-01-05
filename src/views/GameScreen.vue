<template>
  <div>
    <Background />
    <Navbar
      @return-to-Home="returnToHome"
    />

    <div id="content" class="game">
      <!-- Modusauswahl -->
      <ModeSelection
        v-if="!modeSelected"
        @modeSelected="handleModeSelection"
      />

      <!-- Schwierigkeitsauswahl -->
      <DifficultySelection
        v-if="modeSelected && !selectedDifficulty && (modeSelected !== 'versus' || isFirstPlayer)"
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
        :vsBoardData="vsBoardData"
        :playerId="playerId"
        @game-state-updated="handleGameStateUpdate"
        @send-coop-action="handleCoopAction"
        @send-vs-action="handleVsAction"
      />

      <!-- Spielsteuerung -->
      <GameControls
        v-if="selectedDifficulty || players[1]"
        :mode="modeSelected"
        @send-coop-control="handleCoopControl"
        @reset-difficulty="resetDifficulty"
        @load-game="handleLoadGame"
        @game-state-updated="handleGameStateUpdate"
        @reload-gameboard="handleRebuildGameBoard"
      />
    </div>

    <Socket
      ref="socket"
      @build-coop-game-boards="buildCoopGameBoards"
      @buildVsGameBoards="buildVsGameBoards"
      @updateFirstPlayerStatus="handleFirstPlayerStatusUpdate"
      @difficultySet="handleDifficultySet"
      @playerListUpdated="handlePlayerListUpdate"
    />
  </div>
</template>

<script>
import Background from '../components/game/GameBackground.vue';
import Navbar from '../components/game/GameNavbar.vue';
import ModeSelection from '../components/game/ModeSelection.vue';
import DifficultySelection from '../components/game/DifficultySelection.vue';
import GameBoard from '../components/game/GameBoard.vue';
import GameControls from '../components/game/GameControls.vue';
import Socket from '../components/game/GameSocket.vue';

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
      coopBoardData: {},
      vsBoardData: [],
      isFirstPlayer: false,
      players: [],
      playerId: null,
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
      if (mode === 'versus') {
        this.$refs.socket.connectVsWebSocket();
      }
    },
    handleDifficultySelection(difficulty, mode) {
      switch (mode) {
        case 'single':
          this.selectedDifficulty = difficulty;
          break;
        case 'coop':
          this.$refs.socket.sendCoopAction('setDifficulty', { level: difficulty });
          this.selectedDifficulty = difficulty; // Fügen Sie dies hinzu
          break;
        case 'versus':
          this.$refs.socket.sendVsAction('setDifficulty', { level: difficulty });
          if (this.isFirstPlayer || mode !== 'versus') {
            this.selectedDifficulty = difficulty;
          }
          break;
      }
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
    buildVsGameBoards(gameStates, playerId) {
      this.vsBoardData = gameStates;
      this.playerId = playerId;
      this.handleRebuildGameBoard();
    },
    async handleRebuildGameBoard() {
      if (this.$refs.gameBoard) {
        this.$refs.gameBoard.buildGameBoard();
      }
    },
    handleCoopAction(action, x, y) {
      this.$refs.socket.sendCoopAction(action, { x: x, y: y });
    },
    handleCoopControl(action) {
      this.$refs.socket.sendCoopAction(action, {});
    },
    handleVsAction(action, x, y) {
      this.$refs.socket.sendVsAction(action, { x: x, y: y });
    },
    handleFirstPlayerStatusUpdate(isFirstPlayer) {
      this.isFirstPlayer = isFirstPlayer;
    },
    handleDifficultySet(level) {
      this.selectedDifficulty = level;
    },
    handlePlayerListUpdate(players) {
      this.players = players;
    },
  },
  watch: {
    "players[1]": function (newValue) {
      if (newValue) {
        this.handleRebuildGameBoard();
      }
    }
  }
};
</script>

<style scoped>
/* Hauptinhalt */
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

/* Spielerliste Styling */
#playersContainer {
  margin: 1rem 0;
  text-align: center;
}

.player-item {
  font-size: 1.2rem;
  margin: 0.2rem 0;
}

.player-count {
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
