<template>
  <div id="content" class="game">
    <div id="video-background">
      <video autoplay loop muted playsinline>
        <source src="../../app/assets/Minesweeper.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>

    <nav id="top-nav">
      <a id="logo">Minesweeper</a>
    </nav>

    <div id="modeSelection">
      <button id="singleMode" class="btn-custom mx-2">Single Player</button>
      <button id="coopMode" class="btn-custom mx-2">Cooperative</button>
      <button id="vsMode" class="btn-custom mx-2">Versus</button>
    </div>

    <div id="difficulty">
      <button id="easy" class="btn-custom mx-2">Easy</button>
      <button id="medium" class="btn-custom mx-2">Medium</button>
      <button id="hard" class="btn-custom mx-2">Hard</button>
    </div>

    <div id="gameBoard"></div>

    <div id="controls">
      <button id='undo' class="btn-custom mx-2">Undo</button>
      <button id='restart' class="btn-custom mx-2">Restart</button>
      <button id='saveGame' class="btn-custom mx-2">Save Game</button>
      <button id='loadGamePage' class="btn-custom mx-2">Load Game</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startGameMode(mode) {
      console.log(`${mode} mode selected.`);
    },
    setDifficulty(level) {
      console.log(`Difficulty set to ${level}.`);
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

    /* Video Background */
    #video-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
    }

    #video-background video {
        position: absolute;
        top: 50%;
        left: 50%;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: -1;
        transform: translate(-50%, -50%);
        object-fit: cover;
        opacity: 0.8;
    }

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

    #gameBoard {
        display: flex;
        flex-direction: column;
        max-width: 75vw;
        max-height: 75vh;
        margin-top: 2%;
        margin-bottom: 2%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        padding: 1vw;
        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
        background-color: rgba(255, 255, 255, 0.2);
    }

    .btn-custom {
        padding: 0.75rem 1.5rem;
        font-size: 1.25rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        background-color: #6a7d91; /* Dunkles Grau-Blau */
        border: none;
        color: white;
    }

    .btn-custom:hover, .btn-custom:focus {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        background-color: #7b8da1; /* Etwas helleres Grau-Blau */
    }

</style>
