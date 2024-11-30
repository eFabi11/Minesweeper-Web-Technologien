<template>
    <div></div>
</template>

<script>
import { watch } from "vue";

export default {
  data() {
    return {
      gameID: null,
      coopSocket: null,
      vsSocket: null,
      isCoopMode: false,
      playerId: null,
      isFirstPlayer: false,
      players: []
    };
  },
  methods: {
    // Connect to Coop WebSocket
    connectCoopWebSocket() {
      this.gameID = prompt("Enter a game ID to join or create a new game:", "game_" + Date.now());

      const socketUrl = `ws://localhost:9000/coop/ws/${this.gameID}`;
      console.log("Connecting to WebSocket at URL:", socketUrl);
      this.coopSocket = new WebSocket(socketUrl);

      this.coopSocket.onopen = () => {
        console.log("Coop WebSocket connected.");
      };

      this.coopSocket.onmessage = (event) => {
        console.log("Message received from WebSocket:", event.data);
        const data = JSON.parse(event.data);
        if (data.gameState) {
          console.log("Game state received:", data.gameState);
          this.$emit("build-coop-game-boards", data);
        }
      };

      this.coopSocket.onclose = () => {
        console.log("Coop WebSocket closed.");
      };

      this.coopSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    },

    // Send actions to Coop WebSocket
    sendCoopAction(action, data) {
      console.log("Sending action via WebSocket:", action, data);
      if (this.coopSocket && this.coopSocket.readyState === WebSocket.OPEN) {
        const message = {
          action: action,
          data: data
        };
        this.coopSocket.send(JSON.stringify(message));
        console.log("Action sent:", message);
      } else {
        console.warn("WebSocket is not open. Ready state:", this.coopSocket.readyState);
      }
    },

    // Connect to Versus WebSocket
    connectVsWebSocket() {
      if (this.vsSocket && this.vsSocket.readyState === WebSocket.OPEN) {
        console.log("Closing existing WebSocket connection...");
        this.vsSocket.close();
      }

      const socketUrl = `ws://${window.location.host}/vs/ws/${this.gameID}/${this.playerId}`;
      console.log("Connecting to Versus WebSocket at URL:", socketUrl);

      this.vsSocket = new WebSocket(socketUrl);

      this.vsSocket.onopen = () => {
        console.log("Versus WebSocket connected.");
      };

      this.vsSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        switch (data.action) {
          case "setDifficulty":
            if (data.players) {
              this.players = data.players;
              this.isFirstPlayer = (this.playerId === this.players[0]);
              console.log("Player list updated in 'setDifficulty':", this.players);
              console.log("isFirstPlayer:", this.isFirstPlayer);
            }
            break;

          case "updatePlayers":
            this.players = data.players;
            this.isFirstPlayer = (this.playerId === this.players[0]);
            console.log("Player list updated in 'updatePlayers':", this.players);
            console.log("isFirstPlayer:", this.isFirstPlayer);
            this.renderPlayerList(this.players);
            break;

          case "gameState":
            this.updateVsGameState(data);
            break;

          case "error":
            alert(data.message || "An error occurred.");
            break;

          case "gameFull":
            alert("The game is full!");
            break;

          default:
            console.warn("Unknown action:", data.action);
        }
      };

      this.vsSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.vsSocket.onclose = () => {
        console.log("Versus WebSocket closed.");
      };
    },

    // Send actions to Versus WebSocket
    sendVsAction(action, data) {
      console.log("Sending Versus action via WebSocket:", action, data);
      if (this.vsSocket && this.vsSocket.readyState === WebSocket.OPEN) {
        const message = {
          action: action,
          data: data,
          playerId: this.playerId
        };
        this.vsSocket.send(JSON.stringify(message));
        console.log("Versus action sent:", message);
      } else {
        console.warn("Versus WebSocket is not open. Ready state:", this.vsSocket.readyState);
      }
    },

    // Update the game state for Versus mode
    updateVsGameState(data) {
      console.log("Updating game state:", data);
      this.buildVsGameBoards(data.gameStates);
    },

    // Render the player list
    renderPlayerList(players) {
      // Assuming this is a DOM element for player list rendering
      const playersContainer = document.getElementById('playersContainer');
      playersContainer.innerHTML = '';
      players.forEach((player) => {
        playersContainer.innerHTML += `<div class="player-item">${player}</div>`;
      });
      playersContainer.innerHTML += `<div class="player-count">Players: ${players.length} / 4</div>`;
    },

    // Build the game boards for all players
    buildVsGameBoards(gameStates) {
      const gameBoard = document.getElementById('gameBoard');
      console.log("Building game boards for all players");

      gameBoard.classList.add('vs-mode');
      gameBoard.innerHTML = ''; // Clear the game area

      gameStates.forEach(state => {
        const playerName = state.playerId;
        const gameData = state.gameData;

        let boardHtml = `<div class="player-board" id="board-${playerName}">`;
        boardHtml += `<h3>${playerName}</h3>`;
        boardHtml += this.buildGameBoardHtml(gameData, playerName);
        boardHtml += `</div>`;

        gameBoard.innerHTML += boardHtml;
      });

      // Enable interactions only for the current player's game board
      document.querySelectorAll(`.cell[data-player="${this.playerId}"]`).forEach(cell => {
        cell.addEventListener('click', (e) => {
          const x = e.target.dataset.x;
          const y = e.target.dataset.y;
          console.log("Cell clicked at:", x, y);
          this.uncoverCell(x, y);
        });
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const x = e.target.dataset.x;
          const y = e.target.dataset.y;
          console.log("Cell right-clicked at:", x, y);
          this.flagCell(x, y);
        });
      });
    },

    // Generate the game board HTML for a player
    buildGameBoardHtml(data, playerName) {
      const { rows, cols, cells } = data;
      let boardHtml = '<div class="gameBoard">';
      for (let row = 0; row < rows; row++) {
        boardHtml += '<div class="game-row">';
        for (let col = 0; col < cols; col++) {
          const cellValue = cells[row][col];
          let cellClasses = 'cell';
          let cellContent = '';
          switch (cellValue) {
            case '-':
              cellClasses += ' covered';
              break;
            case 'f':
              cellClasses += ' flag';
              cellContent = '&#x1F6A9;';
              break;
            case '*':
              cellClasses += ' bomb';
              cellContent = '<img src="/assets/Mine.png" alt="Mine" class="mine-icon">';
              break;
            case ' ':
            case '0':
              cellClasses += ' empty';
              cellContent = '&nbsp;';
              break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
              cellClasses += ' number';
              cellContent = cellValue;
              break;
            default:
              cellClasses += ' unknown';
              break;
          }
          if (playerName === this.playerId) {
            cellClasses += ' own-cell';
          }
          boardHtml += `<div class="${cellClasses}" data-x="${row}" data-y="${col}" data-player="${playerName}">
                          <span class="cell-content">${cellContent}</span></div>`;
        }
        boardHtml += '</div>';
      }
      boardHtml += '</div>';

      return boardHtml;
    },

    uncoverCell(x, y) {
      // Add your logic to uncover a cell here
      console.log(`Uncovering cell at (${x}, ${y})`);
    },

    flagCell(x, y) {
      // Add your logic to flag a cell here
      console.log(`Flagging cell at (${x}, ${y})`);
    }
  }
};
</script>
