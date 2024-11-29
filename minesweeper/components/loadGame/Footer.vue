<template>
  <footer class="text-center my-5">
    <h1>
      <button id="start-game-btn" class="btn start-game-button" @click="startNewGame">
        Start New Game
      </button>
    </h1>
  </footer>
</template>

<script>
import axios from "axios";

export default {
  name: "FooterComponent",
  methods: {
    startNewGame() {
      axios
        .post("http://localhost:9000/game")
        .then((response) => {
          document.head.innerHTML = response.data.head;
          document.body.innerHTML = response.data.body;
        })
        .catch((error) => {
          console.log("Error:", error);
          alert("Something went wrong! Please try again.");
        });
    },
  },
};
</script>

<style scoped>

    /* Custom styles for the Start Game button */
    .start-game-button {
        font-size: 2.5rem;
        padding: 15px 30px;
        border-radius: 8px;
        background-color: #28a745;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        transition: background-color 0.5s, transform 0.5s;
    }

    .start-game-button:hover {
        background-color: #218838;
        transform: scale(1.25);
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        .start-game-button {
            font-size: 1.8rem;
            padding: 10px 20px;
        }
    }

    @media (max-width: 576px) {
        .start-game-button {
            font-size: 1.5rem;
            padding: 8px 16px;
        }
    }

</style>
