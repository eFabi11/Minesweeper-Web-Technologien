<template>
  <div>
    <Header />
    <GamesList
        @load-game="handleLoadGame"
    />
    <Footer
        @start-new-game="startNewGame"
    />
  </div>
</template>

<script>
import Header from '../components/loadGame/GameHeader.vue';
import GamesList from '../components/loadGame/GamesList.vue';
import Footer from '../components/loadGame/GameFooter.vue';

export default {
  name: "LoadGamePage",
  components: {
    Header,
    GamesList,
    Footer,
  },

  methods: {
    startNewGame() {
      this.$emit('start-new-game');
    },
    handleLoadGame() {
      this.$emit('load-existing-game');
    },
  }
};
</script>

<style>

    @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
    @import url(https://fonts.googleapis.com/css?family=Bitter);

    /* General Styles */
    * {
        font-family: 'Bitter', 'Arial', sans-serif;
        text-align: center;
    }

    /* Active section styling */
    section.active {
        border: 2px solid #007bff;
        background-color: rgba(0, 123, 255, 0.04);
    }

    nav a.active {
        color: #007bff;
        font-weight: bold;
    }

    .container {
        background-color: rgba(255, 255, 255, 0.75);
        padding: 60px;
        border-radius: 100px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        .container {
            padding: 30px;
        }
    }

    @media (max-width: 576px) {
        .container {
            padding: 20px;
        }
    }
</style>
