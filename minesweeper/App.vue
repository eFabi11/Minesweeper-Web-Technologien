<template>
  <div>
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
    <StartGame />
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
  mounted() {
    // Add event listeners when the component is mounted
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('load', this.onLoad);
  },
  beforeDestroy() {
    // Clean up event listeners when the component is destroyed
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('load', this.onLoad);
  },
  methods: {
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
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
