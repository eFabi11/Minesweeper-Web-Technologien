<template>
  <div>
    <h2>How to Play</h2>
        <p>Minesweeper is a puzzle game where the player's goal is to clear a rectangular board containing hidden "mines" or bombs without detonating any of them. Players reveal cells on the grid by clicking on them. If a cell containing a mine is revealed, the player loses the game. If the revealed cell does not contain a mine, a number will be displayed in the cell, indicating how many adjacent cells contain mines.</p>
        <p>The player uses this information to deduce which neighboring cells are safe to reveal and can mark suspected mine locations with flags. The game is won when all mine-free cells are revealed without detonating a mine.</p>
  </div>
</template>

<script>
export default {
  name: "HowToPlay"
};
</script>

<style scoped>

    /* Heading */
    h2 {
        color: #007bff;
        margin-top: 15px;
    }

    p {
        text-align: justify;
        line-height: 1.6;
        margin-bottom: 15px;
    }

</style>
