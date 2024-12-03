<template>
    <header>
        <nav id="top-nav">
            <a id="logo" @click="returnToHome">Minesweeper</a>
        </nav>
    </header>
</template>

<script>
export default {
  methods: {
    returnToHome() {
      this.$emit('return-to-home');
    },
  },
};
</script>

<style scoped>

    #top-nav {
        background-color: #444; /* Dunkles Grau */
        padding: 10px 20px;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
    }

    #top-nav #logo {
        color: #fff; /* Weißer Text */
        text-decoration: none;
        font-size: 1.8rem;
        font-weight: bold;
    }

    #top-nav #logo:hover {
        color: #ccc; /* Helleres Grau beim Hover */
    }
</style>
