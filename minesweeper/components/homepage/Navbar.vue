<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#title">Minesweeper</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" href="#how-to-play">How to Play</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#history">History</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#function">Function</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#visuals">Game Visuals</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#feedback">Feedback</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#start-game">Start Game</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar"
};
</script>

<style scoped>

    /* Bootstrap Overrides */
    .navbar {
      background-color: #007bff;
    }
    .navbar-nav .nav-item .nav-link {
      color: white !important;
    }
    .navbar-nav .nav-item .nav-link.active {
      font-weight: bold;
      color: #ffc107 !important;
    }

</style>
