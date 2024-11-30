<template>
  <div id="gameBoard">
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
            <img src="./assets/Mine.png" alt="💣" class="mine-icon" />
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

    <!-- Game over message -->
    <div v-if="gameState === 'Lost'" id="you-lost">
      <img src="../../app/assets/you_lost.png" alt="You Lost" class="lost-image" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
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
    }
  },
  name: "GameBoard",
  setup(props, { emit }) {
    const gameBoardData = ref({ rows: [], cols: 0, cells: [] });

    watch(
      () => props.gameState,
      (newGameState) => {
        console.log("Game state changed to:", newGameState);
      }
    );

    watch(
      () => props.mode,
      (gameMode) => {
        console.log("Game mode changed to:", gameMode);
      }
    );

    const buildGameBoard = async () => {
      console.log("Building game board in ", props.mode, " mode");

      if (props.mode === "coop") {
        console.log("Build GameBoard for Coop mode");
        watch(
          () => props.coopBoardData,
          (data) => {
            gameBoardData.value = {
              rows: data.rows,
              cols: data.cols,
              cells: data.cells,
            };
          }
        );
      }

      if (props.mode === "versus") {

      }

      if (props.mode === "single") {
        try {
          const response = await axios.post("http://localhost:9000/game/getGameBoard");
          const data = response.data;
          console.log("Game board data received from server");

          gameBoardData.value = {
            rows: data.rows,
            cols: data.cols,
            cells: data.cells,
          };

          console.log("Game State before displayBombs condition:", props.gameState);

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
      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);

      fetch("http://localhost:9000/game/uncover", {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
        .then(response => response.json())
        .then(data => {
          console.log("successfully uncovered: ", x, ":", y);
          emit('game-state-updated', data.gameState);
        })
        .catch(error => {
          console.error('Error at uncovering cell:', error);
          alert('Error at uncovering cell!');
        });
    };

    const flagCell = (x, y) => {
      const params = new URLSearchParams();
      params.append('x', x);
      params.append('y', y);

      fetch("http://localhost:9000/game/flag", {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
        .then(response => response.json())
        .then(data => {
          console.log("successfully flagged: ", x, ":", y);
          emit('game-state-updated', data.gameState);
        })
        .catch(error => {
          console.error('Error at flagging cell:', error);
          alert('Error at flagging cell!');
        });
    };

    onMounted(() => {
    if (props.mode === "single") {
        buildGameBoard();
      }
    });

    return {
      buildGameBoard,
      gameBoardData,
      handleCellClick,
      handleCellRightClick,
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

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
#gameBoard.vs-mode {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    margin-top: 20px;
}

#gameBoard.vs-mode .player-board {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#gameBoard.vs-mode .player-board h3 {
    margin-bottom: 10px;
    color: #fff;
}

/* Anpassung der Zellengröße für Versus-Modus */
#gameBoard.vs-mode .cell {
    width: 30px;
    height: 30px;
    font-size: 16px;
    /* Weitere Styles */
}

/* Responsives Design für kleinere Bildschirme */
@media (max-width: 800px) {
    #gameBoard.vs-mode .cell {
        width: 20px;
        height: 20px;
        font-size: 12px;
    }
}

</style>
