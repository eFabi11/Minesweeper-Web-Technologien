<template>
  <div id="start-game">
    <h1 id="start-game" class="my-4">
        <button id="start-game-btn" class="btn start-game-button">Start Game</button>
    </h1>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      gameStarted: false,  // Track whether the game has started
    };
  },
  methods: {
    startGame() {
      // Send the request to start the game
      axios.post('http://localhost:9000/game')
        .then(response => {
          if (response.data.success) {
            this.gameStarted = true;
            // Dynamically insert the page HTML received from the server
            document.head.innerHTML = response.data.page;
            alert("The game has started!");
          } else {
            alert("Failed to start the game.");
          }
        })
        .catch(error => {
          console.error("There was an error starting the game:", error);
          alert("There was an error starting the game.");
        });
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
button {
  padding: 10px 20px;
  font-size: 3rem;
}
</style>
