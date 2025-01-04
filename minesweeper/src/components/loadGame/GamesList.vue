<template>
  <section class="container my-5 p-4 bg-white rounded shadow">
    <h2 class="text-primary">Your Saved Games</h2>
    <ul id="content">
      <li v-for="game in games" :key="game.gameId" class="list-group-item d-flex justify-content-between align-items-center">
        <span class="game-name">Game: {{ game.fileName }}</span>
        <div>
          <button class="btn btn-info btn-sm mr-2" @click="loadGame(game.gameId)">Load</button>
          <button class="btn btn-danger btn-sm" @click="deleteGame(game.gameId)">Delete</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "GamesListComponent",
  data() {
    return {
      games: [],
    };
  },
  methods: {
    fetchGames() {
      axios
        .post("http://localhost:9000/getGamesList")
        .then((response) => {
          this.games = response.data.games;
        })
        .catch((error) => {
          console.error("Error fetching games list:", error);
          alert("Error loading games list. Please try again.");
        });
    },
    loadGame(gameId) {
      axios
        .post(`http://localhost:9000/loadGame/${gameId}`)
        .then((response) => {
            console.log(response.data.field);
        })
        .catch((error) => {
          alert(`Error loading game: ${error}`);
        });
        this.$emit('load-game');
    },
    deleteGame(gameId) {
      axios
        .post(`http://localhost:9000/deleteGame/${gameId}`)
        .then(() => {
          this.fetchGames();
        })
        .catch((error) => {
          alert(`Error deleting game: ${error}`);
        });
    },
  },
  mounted() {
    this.fetchGames();
  },
};
</script>

<style scoped>

    @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        height: auto;
    }

    #content {
        width: 100%;
        padding: 10px;
        margin: 0;
        height: auto;
    }

    /* List Group Styles */
    .list-group-item {
        position: relative;
        display: flex;               /* Ensures items are placed horizontally */
        align-items: center;
        justify-content: space-between; /* Distributes space between content */
        padding: 5px 15px;           /* Reduced padding for space optimization */
        background-color: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 5px;
        margin-bottom: 5px;          /* Optional: Adjust the space between items */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        width: 100%;                 /* Ensure the list item spans the full width */
    }

    .list-group {
        width: 100%;
        padding: 0; /* Remove extra padding around the list */
        margin: 0; /* Remove extra margin around the list */
    }

    .list-group-item .btn {
        flex-shrink: 0; /* Prevent buttons from shrinking */
        margin-left: 10px; /* Adds space between the buttons */
    }

    .list-group-item .btn-info,
    .list-group-item .btn-danger {
        flex-shrink: 0; /* Prevents buttons from shrinking */
    }

    /* Ensure text content or game names take available space */
    .list-group-item .game-name {
        flex-grow: 1;
        text-align: left;
    }

    .list-group-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        .container {
            padding: 15px;
        }
    }

    @media (max-width: 576px) {
        .container {
            padding: 10px;
        }
    }

</style>
