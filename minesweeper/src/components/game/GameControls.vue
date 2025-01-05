<template>
  <div id="controls">
    <button class="btn-custom mx-2" @click="undo">Undo</button>
    <button class="btn-custom mx-2" @click="restart">Restart</button>
    <button class="btn-custom mx-2" @click="saveGame">Save Game</button>
    <button class="btn-custom mx-2" @click="loadGame">Load Game</button>
  </div>
</template>

<script>

export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  methods: {
    undo() {
      if (this.mode === "coop") {
        this.$emit("send-coop-control", "undo");
      } else if (this.mode === "single") {
        const params = new URLSearchParams();

        fetch('http://localhost:9000/game/undo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(), // Empty params for the undo action
        })
          .then(response => response.json())
          .catch(error => {
            console.error('Error undoing:', error);
            alert('Error undoing. Please check the server response.');
          });
          this.$emit("reload-gameboard");
      }
    },
    restart() {

      if (this.mode === "coop") {
        this.$emit("send-coop-control", "restart");
      } else if (this.mode === "single") {
        console.log("Restart action triggered");
        // Send a POST request to restart the game
        const params = new URLSearchParams();

        fetch('http://localhost:9000/game/restart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
            body: params.toString(), // Empty params for the restart action
        })
        .then(response => response.json())
        .catch(error => {
          console.error('Error restarting:', error);
          alert('Error restarting. Please check the server response.');
        });
        this.$emit("reload-gameboard");
      }
    },
    saveGame() {
      console.log("Save game action triggered");

      // Send AJAX request to save the game
      fetch('http://localhost:9000/game/save', {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => {
          console.log('data set:', data);
          console.log('Save game successful');
        })
        .catch(error => {
          console.error('Error saving game:', error);
          alert('Error saving game. Please check the server response.');
        });
    },
    loadGame() {
      this.$emit('load-game'); // Event für "Load Game" auslösen
    },
  },
};
</script>

<style scoped>
#controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn-custom {
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #6a7d91;
  border: none;
  color: white;
}

.btn-custom:hover,
.btn-custom:focus {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background-color: #7b8da1;
}
</style>
