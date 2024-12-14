<template>
  <div id="gameBoard">
    <!-- Versus Mode -->
    <div v-if="mode === 'versus'" class="vs-mode">
      <div
        v-for="(board) in vsGameBoards"
        :key="board.playerId"
        class="player-board"
      >
        <h3>{{ board.playerId }}</h3>
        <div
          v-for="(row, i) in board.gameData.rows"
          :key="i"
          class="game-row"
        >
          <div
            v-for="(cellValue, j) in row"
            :key="j"
            :class="getCellClasses(cellValue, board.playerId)"
            :data-x="i"
            :data-y="j"
            @click="board.playerId === playerId ? handleCellClick(i, j) : null"
            @contextmenu.prevent="board.playerId === playerId ? handleCellRightClick(i, j) : null"
          >
            <span class="cell-content">
              <!-- Dynamic cell content -->
              <template v-if="cellValue === '*'">
                <img src="@/assets/Mine.png" alt="💣" class="mine-icon">
              </template>
              <template v-else-if="cellValue === 'f'">
                &#x1F6A9; <!-- Flag emoji -->
              </template>
              <template v-else-if="cellValue === '-'">
                &nbsp; <!-- Covered cell -->
              </template>
              <template v-else>
                {{ cellValue }}
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Single and Coop Modes -->
    <div v-else>
      <div
        v-for="(row, i) in gameBoardData.rows"
        :key="i"
        class="game-row"
      >
        <div
          v-for="(cell, j) in row"
          :key="j"
          :class="['cell', cell.state]"
          :data-x="i"
          :data-y="j"
          @click="handleCellClick(i, j)"
          @contextmenu.prevent="handleCellRightClick(i, j)"
        >
          <span class="cell-content">
            <!-- Dynamic cell content -->
            <template v-if="cell.state === 'bomb'">
              <img src="@/assets/Mine.png" alt="💣" class="mine-icon" />
            </template>
            <template v-else-if="cell.state === 'flag'">
              &#x1F6A9; <!-- Flag emoji -->
            </template>
            <template v-else-if="cell.state === 'empty'">
              &nbsp; <!-- Empty space -->
            </template>
            <template v-else-if="cell.state === 'number'">
              {{ cell.value }}
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- Game over message -->
    <div v-if="gameState === 'Lost'" id="you-lost">
      <img src="@/assets/you_lost.png" alt="You Lost" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
  name: "GameBoard",
  props: {
    gameState: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    coopBoardData: {
      type: Object,
    },
    vsBoardData: {
      type: Array,
    },
    playerId: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const gameBoardData = ref({ rows: [], cols: 0, cells: [] });
    const vsGameBoards = ref([]);

    // Watch for changes in gameState
    watch(
      () => props.gameState,
      (newGameState) => {
        console.log("Game state changed to:", newGameState);
      }
    );

    // Watch for changes in mode
    watch(
      () => props.mode,
      (gameMode) => {
        console.log("Game mode changed to:", gameMode);
      }
    );

    const buildGameBoard = async () => {
      console.log("Building game board in ", props.mode, " mode");

      if (props.mode === "coop") {
        watch(
          () => props.coopBoardData,
          (data) => {
            if (data) {
              gameBoardData.value = {
                rows: data.cells,
                cols: data.cols,
                cells: data.cells,
              };
              console.log("Coop game board data updated:", gameBoardData.value);
            }
          },
          { immediate: true }
        );
        console.log("Build GameBoard for Coop mode with: ", props.coopBoardData);
      }

      if (props.mode === "versus") {
        watch(
          () => props.vsBoardData,
          (newVsBoardData) => {
            console.log("Neue vsBoardData erhalten:", newVsBoardData);
            if (newVsBoardData && newVsBoardData.length > 0) {
              vsGameBoards.value = newVsBoardData.map((state) => {
                return {
                  playerId: state.playerId,
                  gameData: {
                    rows: state.gameData.cells,
                    cols: state.gameData.cols,
                    cells: state.gameData.cells,
                  },
                };
              });
              console.log("vsGameBoards aktualisiert:", vsGameBoards.value);
            }
          },
          { immediate: true }
        );
      }

      if (props.mode === "single") {
        try {
          const response = await axios.post("http://localhost:9000/game/getGameBoard");
          const data = response.data;
          console.log("Game board data received from server");

          gameBoardData.value = {
            rows: data.cells,
            cols: data.cols,
            cells: data.cells,
          };

          if (props.gameState === "Lost" || props.gameState === "Won") {
            console.log("Game over. State:", props.gameState);
            await displayBombs();
          }
        } catch (error) {
          console.error("Error fetching game board:", error);
        }
      }
    };

    const handleCellClick = (x, y) => {
      console.log("Cell clicked at:", x, y);
      uncoverCell(x, y);
    };

    const handleCellRightClick = (x, y) => {
      console.log("Cell right-clicked at:", x, y);
      flagCell(x, y);
    };

    const displayBombs = async () => {
      try {
        const response = await axios.post("http://localhost:9000/game/getBombMatrix");
        const bombMatrix = response.data;
        console.log("Bomb matrix received from server:", bombMatrix);

        const updatedRows = gameBoardData.value.rows.map((row, y) =>
          row.map((cell, x) => {
            const cellContent = bombMatrix[x]?.[y];
            return {
              ...cell,
              state: cellContent === "*" ? "bomb" : "revealed",
              value: cellContent === "*" ? "💣" : cellContent,
            };
          })
        );

        gameBoardData.value = {
          ...gameBoardData.value,
          rows: updatedRows,
        };
      } catch (error) {
        console.error("Error fetching bomb matrix:", error);
        alert("Error fetching bomb matrix. Please check the server.");
      }
    };

    const uncoverCell = (x, y) => {
      if (props.mode === "coop") {
        emit("send-coop-action", "uncover", x, y);
      } else if (props.mode === "versus") {
        emit("send-vs-action", "uncover", x, y);
      } else if (props.mode === "single") {
        const params = new URLSearchParams();
        params.append("x", x);
        params.append("y", y);

        fetch("http://localhost:9000/game/uncover", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Successfully uncovered:", x, ":", y);
            emit("game-state-updated", data.gameState);
          })
          .catch((error) => {
            console.error("Error uncovering cell:", error);
            alert("Error uncovering cell!");
          });
      }
    };

    const flagCell = (x, y) => {
      if (props.mode === "coop") {
        emit("send-coop-action", "flag", x, y);
      } else if (props.mode === "versus") {
        emit("send-vs-action", "flag", x, y);
      } else if (props.mode === "single") {
        const params = new URLSearchParams();
        params.append("x", x);
        params.append("y", y);

        fetch("http://localhost:9000/game/flag", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Successfully flagged:", x, ":", y);
            emit("game-state-updated", data.gameState);
          })
          .catch((error) => {
            console.error("Error flagging cell:", error);
            alert("Error flagging cell!");
          });
      }
    };

    const getCellClasses = (cellValue, boardPlayerId) => {
      let cellClasses = ["cell"];
      if (cellValue === "-") {
        cellClasses.push("covered");
      } else if (cellValue === "f") {
        cellClasses.push("flag");
      } else if (cellValue === "*") {
        cellClasses.push("bomb");
      } else if (cellValue === " " || cellValue === "0") {
        cellClasses.push("empty");
      } else {
        cellClasses.push("number");
      }
      if (boardPlayerId === props.playerId) {
        cellClasses.push("own-cell");
      }
      return cellClasses;
    };

    onMounted(() => {
      buildGameBoard();
    });

    return {
      buildGameBoard,
      gameBoardData,
      vsGameBoards,
      handleCellClick,
      handleCellRightClick,
      getCellClasses,
    };
  },
};
</script>

<style scoped>
/* Game Board */
#gameBoard {
  z-index: 2;
  display: flex;
  flex-direction: column;
  max-width: 75vw;
  max-height: 75vh;
  margin-top: 2%;
  margin-bottom: 2%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1vw;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.2);
}

.mine-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Game Row */
.game-row {
  display: flex;
}

/* Game Cell */
.cell {
  width: 2vw;
  height: 2vw;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  font-size: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cell:hover {
  transform: scale(1.05);
  background-color: rgba(255, 255, 255, 0.1);
}

/* Chessboard Pattern */
.cell.covered:nth-child(even) {
  background-color: #2c3e50;
}

.cell.covered:nth-child(odd) {
  background-color: #34495e;
}

/* Revealed Cells */
.cell.revealed {
  background-color: #192b38 !important;
  color: #2c3e50;
  font-weight: bold;
}

/* Flagged Cells */
.cell.flag {
  background-color: #f1c40f !important;
}

/* Bomb Cells */
.cell.bomb {
  background-color: #ccc !important;
}

/* Versus Mode Styles */
#gameBoard .vs-mode {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

#gameBoard .vs-mode .player-board {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#gameBoard .vs-mode .player-board h3 {
  margin-bottom: 10px;
  color: #fff;
}

/* Adjust cell size for Versus Mode */
#gameBoard .vs-mode .cell {
  width: 30px;
  height: 30px;
  font-size: 16px;
}

/* Responsive design for smaller screens */
@media (max-width: 800px) {
  #gameBoard .vs-mode .cell {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
}

/**/

#you-lost img {
    width: 100%;
    max-width: 300px; /* Passe die maximale Breite nach Bedarf an */
    margin: 0 auto;
    filter: brightness(1) invert(0);
    display: block;
    pointer-events: none; /* Verhindert, dass das Bild die Spielfunktion beeinträchtigt */
    ;

}

#you-lost {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100; /* Sicherstellen, dass es über anderen Elementen liegt */
}

.lost-image {
    width: 100%;
    max-width: 500px; /* Passe die maximale Breite nach Bedarf an */
    display: block;
    pointer-events: none; /* Verhindert, dass das Bild die Spielfunktion beeinträchtigt */
    opacity: 1;
}

.lost-image.fade-out {
    animation: fadeOut 2s forwards;
}

</style>
