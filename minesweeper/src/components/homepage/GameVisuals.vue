<template>
  <div>
    <h2>Game Visuals</h2>
        <div class="row">
            <div class="col-sm">
                <figure>
                    <img src="../../assets/EmptyField.png" class="img-fluid visual-image" alt="View of the new Game" title="Empty Field">
                    <figcaption>View of the new Game</figcaption>
                </figure>
            </div>
            <div class="col-sm">
                <figure>
                    <img src="../../assets/Numbers.png" class="img-fluid visual-image" alt="Mark of the Numbers" title="Numbers">
                    <figcaption>Mark of the Numbers</figcaption>
                </figure>
            </div>
            <div class="col-sm">
                <figure>
                    <img src="../../assets/FlagBomb.png" class="img-fluid visual-image" alt="Flagged Bomb" title="Flag Bomb">
                    <figcaption>Flagged Bomb</figcaption>
                </figure>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "GameVisuals"
};
</script>

<style scoped>

    /* Heading */
    h2 {
        color: #007bff;
        margin-top: 15px;
    }

    /* Hover effect for images specifically */
    .visual-image {
        border-radius: 8px;
        display: block;
        margin: 0 auto;
    }

    /* Styling for the figure caption (footnote) */
    figure {
        display: inline-block;
        text-align: center;
        margin: 15px auto;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }

    figure:hover {
        transform: scale(1.015);
    }

    /* Hover effect for images specifically */
    .visual-image {
        border-radius: 8px;
        display: block;
        margin: 0 auto;
    }

    /* Styling for the figure caption (footnote) */
    figcaption {
        font-size: 0.9rem;
        color: #666;
        margin-top: 8px;
        font-style: italic;
        transition: text-shadow 0.3s ease-in-out;
    }

</style>
