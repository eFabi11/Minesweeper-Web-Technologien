<template>
  <div id="start-game">
    <h1 class="my-4">
      <button
        id="start-game-btn"
        class="btn start-game-button"
        @click="startGame">
        Start Game
      </button>
    </h1>
  </div>
</template>

<script>
export default {
  methods: {
    startGame() {
      this.$emit('start-game');
    },
  },
};
</script>

<style scoped>

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
