<template>
  <div>
    <h2>Game Visuals</h2>
        <div class="row">
            <div class="col-sm">
                <figure>
                    <img src="../app/assets/EmptyField.png" class="img-fluid visual-image" alt="View of the new Game" title="Empty Field">
                    <figcaption>View of the new Game</figcaption>
                </figure>
            </div>
            <div class="col-sm">
                <figure>
                    <img src="../app/assets/Numbers.png" class="img-fluid visual-image" alt="Mark of the Numbers" title="Numbers">
                    <figcaption>Mark of the Numbers</figcaption>
                </figure>
            </div>
            <div class="col-sm">
                <figure>
                    <img src="../app/assets/FlagBomb.png" class="img-fluid visual-image" alt="Flagged Bomb" title="Flag Bomb">
                    <figcaption>Flagged Bomb</figcaption>
                </figure>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Visuals"
};
</script>

<style scoped>
h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
p {
  font-size: 1rem;
  color: #555;
}
</style>
