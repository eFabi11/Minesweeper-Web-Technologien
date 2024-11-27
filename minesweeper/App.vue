<template>
  <div>
    <!-- Render default components when the game has not started -->
    <div v-if="!gameStarted">
      <Header />
      <Navbar />
      <section id="how-to-play" class="container mt-4">
        <HowToPlay />
      </section>
      <section id="history" class="container mt-4">
        <History />
      </section>
      <section id="function" class="container mt-4">
        <Function />
      </section>
      <section id="visuals" class="container mt-4">
        <Visuals />
      </section>
      <section id="feedback" class="container mt-4">
        <FeedbackForm />
      </section>
      <StartGame @start-game="startGame" />
    </div>

    <!-- Render game GUI when the game has started -->
    <div v-else>
      <GameGui />
    </div>
  </div>
</template>

<script>
import Header from './components/homepage/Header.vue';
import Navbar from './components/homepage/Navbar.vue';
import HowToPlay from './components/homepage/HowToPlay.vue';
import History from './components/homepage/History.vue';
import Function from './components/homepage/Function.vue';
import Visuals from './components/homepage/Visuals.vue';
import FeedbackForm from './components/homepage/FeedbackForm.vue';
import StartGame from './components/homepage/StartGame.vue';
import GameGui from './components/game/GameGui.vue';

export default {
  components: {
    Header,
    Navbar,
    HowToPlay,
    History,
    Function,
    Visuals,
    FeedbackForm,
    StartGame,
    GameGui,
  },
  data() {
    return {
      gameStarted: false, // Track if the game has started
    };
  },
  mounted() {
    // Add event listeners
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('load', this.onLoad);
  },
  beforeDestroy() {
    // Clean up event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('load', this.onLoad);
  },
  methods: {
    startGame() {
      // Set the game state to started
      this.gameStarted = true;
    },
    handleScroll() {
      const scrollPosition = window.scrollY;
      const navbar = document.getElementById("navbar");

      // Shrink header on scroll
      if (scrollPosition > 1) {
        document.getElementById("header-scroll").classList.add("small");
        navbar.style.display = 'block';
        navbar.classList.add('visible');
      } else {
        document.getElementById("header-scroll").classList.remove("small");
        navbar.classList.remove('visible');
        navbar.style.display = 'none';
      }

      // Active section logic
      const sections = document.querySelectorAll('section');
      const nav = document.querySelector('nav');
      const navHeight = nav.offsetHeight + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - navHeight - 160;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          const sectionId = section.id;
          sections.forEach((s) => s.classList.remove('active'));
          nav.querySelectorAll('a').forEach((a) => a.classList.remove('active'));

          section.classList.add('active');
          nav.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
        }
      });
    },
    onLoad() {
      // Reset header to original style on load
      document.getElementById("header-scroll").classList.remove("small");
    },
  },
};
</script>

<style scoped>
/* General Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Bitter', 'Arial', sans-serif;
}

body {
  background-color: #f5f5f5;
  color: #333;
}

/* Header Styles */
header {
  color: white;
  padding: 160px 0;
  background-image: url('../images/Minesweeper_picture.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

#title {
  font-size: 6.5rem;
  font-weight: bold;
}

#header-scroll {
  transition: height 0.5s ease, padding 0.5s ease;
}

#header-scroll.small {
  height: 50px;
  padding: 10px 0;
}

#header-scroll h1 {
  transition: font-size 0.3s ease;
}

#header-scroll.small h1 {
  font-size: 1.5rem;
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

/* Navbar Styles */
#navbar {
  padding: 0.5rem 1rem;
}

.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}

/* Section Styles */
section {
  padding: 20px;
  margin: 20px auto;
  max-width: 900px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #ccc;
  padding-top: 80px;
  scroll-margin-top: 80px;
}

.container {
  background-color: rgba(255, 255, 255, 0.75);
  padding: 60px;
  border-radius: 100px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
