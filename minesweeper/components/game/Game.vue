<template>
  <div>
    <Background />
    <Navbar />

    <div id="content" class="game">
        <ModeSelection />
    </div>
  </div>
</template>

<script>
import Background from './Background.vue';
import Navbar from './Navbar.vue';
import ModeSelection from './ModeSelection.vue';

export default {
  components: {
    Background,
    Navbar,
    ModeSelection,
  },
};
</script>

<style scoped>

    /* Main Content */
    #content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        padding: 2vw;
        box-sizing: border-box;
        overflow: auto;
        color: white;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
        font-family: 'Poppins', sans-serif;
        margin-top: 5%;
    }

</style>
