<template>
  <div :style="{ backgroundColor: '#f5f5f5' }">
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
</template>

<script>
/* Imports of Components for Homepage */
import Header from '../components/homepage/GameHeader.vue';
import Navbar from '../components/homepage/GameNavbar.vue';
import HowToPlay from '../components/homepage/HowToPlay.vue';
import History from '../components/homepage/GameHistory.vue';
import Function from '../components/homepage/GameFunction.vue';
import Visuals from '../components/homepage/GameVisuals.vue';
import FeedbackForm from '../components/homepage/FeedbackForm.vue';
import StartGame from '../components/homepage/StartGame.vue';

export default {
  components: {
    Header,
    Navbar,
    HowToPlay,
    History,
    Function,
    Visuals,
    FeedbackForm,
    StartGame
  },
  data() {
    return {
      gameStarted: false, // Track game state
    };
  },
  mounted() {
    // Add event listeners when the component is mounted
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('load', this.onLoad);

    window.scrollTo(0, 0);

    // Smooth scrolling functionality
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const targetSection = document.querySelector(link.getAttribute('href'));
        if (targetSection) {
          const navbarHeight = document.getElementById('navbar').offsetHeight;
          window.scrollTo({
            top: targetSection.offsetTop - navbarHeight - 25,
            behavior: 'smooth',
          });
        }
      });
    });
  },
  beforeUnmount() {
    // Clean up event listeners when the component is destroyed
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('load', this.onLoad);
  },
  methods: {
    startGame() {
      this.$emit('start-game');
    },
    handleScroll() {
      // Get scroll position
      let scrollPosition = window.scrollY;
      const navbar = document.getElementById("navbar");

      // Header shrinking logic on scroll
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
      let sections = document.querySelectorAll('section');
      let nav = document.querySelector('nav');
      let navHeight = nav.offsetHeight + 100;

      sections.forEach(section => {
        let sectionTop = section.offsetTop - navHeight - 160;
        let sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          let sectionId = section.id;
          sections.forEach(s => s.classList.remove('active'));
          nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));

          section.classList.add('active');
          nav.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
        }
      });
    },
    onLoad() {
      // This ensures the header starts with the correct style
      document.getElementById("header-scroll").classList.remove("small");
    },
    removeEventlisteners() {
      // Clean up event listeners when the component is destroyed
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('load', this.onLoad);
    }
  }
};
</script>

<style scoped>

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
