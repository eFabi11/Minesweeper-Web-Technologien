<template>
  <div>
    <Background />
    <Navbar />

    <div id="content" class="game">
      <!-- Modusauswahl -->
      <ModeSelection v-if="!modeSelected" @modeSelected="handleModeSelection" />

      <!-- Schwierigkeitsauswahl -->
      <DifficultySelection
        v-if="modeSelected && !difficultySelected"
        @difficultySelected="handleDifficultySelection"
      />

      <!-- Spielfeld -->
      <GameBoard
        v-if="difficultySelected"
        :cells="cells"
        @cellClick="handleCellClick"
        @cellFlag="handleCellFlag"
      />

      <!-- Spielsteuerung -->
      <GameControls
        v-if="difficultySelected"
        @undo="handleUndo"
        @restart="handleRestart"
        @save-game="handleSaveGame"
        @load-game="handleLoadGame"
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


const backendUrl = 'http://localhost:9000';

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
      modeSelected: null,
      difficultySelected: null,
      cells: [], // Initialisiere das Spielfeld
    };
  },
  methods: {
    handleModeSelection(mode) {
      this.modeSelected = mode;
      // Weitere Logik je nach Modus
    },
    handleDifficultySelection(difficulty) {
      this.difficultySelected = difficulty;
      this.initializeGameBoard(difficulty);
    },
    initializeGameBoard(difficulty) {
      const params = new URLSearchParams();
      params.append('level', difficulty);

      fetch(`${backendUrl}/game/setDifficulty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
        .then(response => response.json())
        .then(() => {
          return fetch(`${backendUrl}/game/getGameBoard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
        })
        .then(response => response.json())
        .then(data => {
          console.log('Spielbrettdaten:', data);
          this.cells = data.cells;
        })
        .catch(error => {
          console.error('Fehler beim Initialisieren des Spielfelds:', error);
        });
    },
    handleCellClick({ row, col }) {
      const params = new URLSearchParams();
      params.append('x', row);
      params.append('y', col);

      fetch('/game/uncover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
        .then(response => response.json())
        .then(data => {
          this.cells = data.cells;
        })
        .catch(error => {
          console.error('Fehler beim Aufdecken des Feldes:', error);
        });
    },
    handleCellFlag({ row, col }) {
      const params = new URLSearchParams();
      params.append('x', row);
      params.append('y', col);

      fetch('/game/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
        .then(response => response.json())
        .then(data => {
          this.cells = data.cells;
        })
        .catch(error => {
          console.error('Fehler beim Markieren des Feldes:', error);
        });
    },
    handleUndo() {
      fetch('/game/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then(response => response.json())
        .then(data => {
          this.cells = data.cells;
        })
        .catch(error => {
          console.error('Fehler beim Ausführen von Undo:', error);
        });
    },
    handleRestart() {
      fetch('/game/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then(response => response.json())
        .then(data => {
          this.cells = data.cells;
        })
        .catch(error => {
          console.error('Fehler beim Neustart des Spiels:', error);
        });
    },
    handleSaveGame() {
      fetch('/game/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then(response => response.json())
        .then(data => {
          console.log('Spiel erfolgreich gespeichert');
        })
        .catch(error => {
          console.error('Fehler beim Speichern des Spiels:', error);
        });
    },
    handleLoadGame() {
      // Implementieren Sie die Ladefunktion entsprechend Ihren Anforderungen
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
