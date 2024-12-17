<template>
  <div></div>
</template>

<script>

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
    // Verbindung zum Coop WebSocket herstellen
    connectCoopWebSocket() {
      this.gameID = prompt("Geben Sie eine Spiel-ID ein, um einem Spiel beizutreten oder ein neues Spiel zu erstellen:", "game_" + Date.now());

      const socketUrl = `ws://localhost:9000/coop/ws/${this.gameID}`;
      console.log("Verbindung zum WebSocket unter URL herstellen:", socketUrl);
      this.coopSocket = new WebSocket(socketUrl);

      this.coopSocket.onopen = () => {
        console.log("Coop WebSocket verbunden.");
      };

      this.coopSocket.onmessage = (event) => {
        console.log("Nachricht vom WebSocket erhalten:", event.data);
        const data = JSON.parse(event.data);
        if (data.gameState) {
          console.log("Spielzustand erhalten:", data.gameState);
          this.$emit("build-coop-game-boards", data);
        }
      };

      this.coopSocket.onclose = () => {
        console.log("Coop WebSocket geschlossen.");
      };

      this.coopSocket.onerror = (error) => {
        console.error("WebSocket-Fehler:", error);
      };
    },

    // Aktionen an Coop WebSocket senden
    sendCoopAction(action, data) {
      console.log("Senden von Aktion über WebSocket:", action, data);
      if (this.coopSocket && this.coopSocket.readyState === WebSocket.OPEN) {
        const message = {
          action: action,
          data: data
        };
        this.coopSocket.send(JSON.stringify(message));
        console.log("Aktion gesendet:", message);
      } else {
        console.warn("WebSocket ist nicht geöffnet. Bereitschaftszustand:", this.coopSocket.readyState);
      }
    },

    // Verbindung zum Versus WebSocket herstellen
    connectVsWebSocket() {
      this.gameID = prompt("Geben Sie eine Spiel-ID ein, um einem Spiel beizutreten oder ein neues Spiel zu erstellen:", "vs_" + Date.now());
      this.playerId = prompt("Geben Sie Ihren Spielernamen ein:", "Player_" + Date.now());

      if (this.vsSocket && this.vsSocket.readyState === WebSocket.OPEN) {
        console.log("Bestehende WebSocket-Verbindung wird geschlossen...");
        this.vsSocket.close();
      }

      const socketUrl = `ws://localhost:9000/vs/ws/${this.gameID}/${this.playerId}`;
      console.log("Verbindung zum Versus WebSocket unter URL herstellen:", socketUrl);

      this.vsSocket = new WebSocket(socketUrl);

      this.vsSocket.onopen = () => {
        console.log("Versus WebSocket verbunden.");
      };

      this.vsSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Empfangene Nachricht:", data);

        switch (data.action) {
          case "setDifficulty":
            if (data.players) {
              this.players = data.players;
              this.isFirstPlayer = (this.playerId === this.players[0]);
              console.log("Spielerliste aktualisiert in 'setDifficulty':", this.players);
              console.log("isFirstPlayer:", this.isFirstPlayer);
              // Emitieren des ersten Spielerstatus
              this.$emit('updateFirstPlayerStatus', this.isFirstPlayer);
            }
            if (data.level) {
              // Emitieren des Schwierigkeitsgrades
              this.$emit('difficultySet', data.level);
            }
            break;

          case "updatePlayers":
            this.players = data.players;
            this.isFirstPlayer = (this.playerId === this.players[0]);
            console.log("Spielerliste aktualisiert in 'updatePlayers':", this.players);
            console.log("isFirstPlayer:", this.isFirstPlayer);
            // Emitieren des ersten Spielerstatus
            this.$emit('updateFirstPlayerStatus', this.isFirstPlayer);
            // Aktualisieren der Spielerliste
            this.$emit('playerListUpdated', this.players);
            break;

          case "startGame":
            this.handleStartGame(data);
            break;

          case "gameState":
            this.updateVsGameState(data);
            break;

          case "error":
            alert(data.message || "Ein Fehler ist aufgetreten.");
            break;

          case "gameFull":
            alert("Das Spiel ist voll!");
            break;

          default:
            console.warn("Unbekannte Aktion:", data.action);
        }
      };

      this.vsSocket.onerror = (error) => {
        console.error("WebSocket-Fehler:", error);
      };

      this.vsSocket.onclose = () => {
        console.log("Versus WebSocket geschlossen.");
      };
    },

    // Aktionen an Versus WebSocket senden
    sendVsAction(action, data) {
      console.log("Senden von Versus-Aktion über WebSocket:", action, data);
      if (this.vsSocket && this.vsSocket.readyState === WebSocket.OPEN) {
        const message = {
          action: action,
          data: data,
          playerId: this.playerId
        };
        this.vsSocket.send(JSON.stringify(message));
        console.log("Versus-Aktion gesendet:", message);
      } else {
        console.warn("Versus WebSocket ist nicht geöffnet. Bereitschaftszustand:", this.vsSocket.readyState);
      }
    },

    // Aktualisieren des Spielzustands für Versus-Modus
    updateVsGameState(data) {
      console.log("Aktualisieren des Spielzustands:", data);
      console.log("Empfangene gameStates:", data.gameStates); // Fügen Sie dies hinzu
      this.buildVsGameBoards(data.gameStates);
    },

    // Aufbau der Spielbretter für alle Spieler
    buildVsGameBoards(gameStates) {
      // Emitieren der Spielbretter an das Eltern-Component
      console.log("Emitieren der Spielbretter an das Eltern-Component:", gameStates);
      this.$emit('buildVsGameBoards', gameStates, this.playerId);
    },

    // Aufdecken einer Zelle
    uncoverCell(x, y) {
      console.log(`Aufdecken der Zelle bei (${x}, ${y})`);
      this.sendVsAction('uncoverCell', { x: x, y: y });
    },

    // Markieren einer Zelle
    flagCell(x, y) {
      console.log(`Markieren der Zelle bei (${x}, ${y})`);
      this.sendVsAction('flagCell', { x: x, y: y });
    },

    // Behandlung des Spielstarts
    handleStartGame(data) {
      console.log("Spiel gestartet:", data);
      // Hier können Sie zusätzliche Initialisierungen vornehmen
    },

    // Rendern der Spielerliste (nicht mehr erforderlich, da wir Vue-Datenbindung verwenden)
    // renderPlayerList(players) {
    //   // Diese Methode ist jetzt obsolet
    // },

    // Generieren des Spielbrett-HTMLs für einen Spieler (nicht mehr erforderlich, da dies im GameBoard.vue erledigt wird)
    // buildGameBoardHtml(data, playerName) {
    //   // Diese Methode ist jetzt obsolet
    // },
  }
};
</script>
