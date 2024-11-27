import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Scroll handling logic
app.directive('scroll', {
  mounted(el) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const navbar = document.getElementById('navbar');

      // Control Header and Navbar visibility
      if (scrollPosition > 1) {
        document.getElementById('header-scroll').classList.add('small');
        navbar.style.display = 'block';
        navbar.classList.add('visible');
      } else {
        document.getElementById('header-scroll').classList.remove('small');
        navbar.classList.remove('visible');
        navbar.style.display = 'none';
      }

      // Active section highlighting
      const sections = document.querySelectorAll('section');
      const nav = document.querySelector('nav');
      const navHeight = nav.offsetHeight + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 160;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          const sectionId = section.id;
          sections.forEach(s => s.classList.remove('active'));
          nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));

          section.classList.add('active');
          nav.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
        }
      });
    });
  }
});

app.mount('#app');
