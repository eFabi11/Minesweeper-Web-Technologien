<template>
  <div>
    <h2>Game Function</h2>
        <ol class="list-group">
            <li class="list-group-item">Choose the difficulty between easy, medium, or hard</li>
            <li class="list-group-item">By left-clicking on a field you can open a field</li>
            <li class="list-group-item">By right-clicking on a field you can flag a field</li>
            <li class="list-group-item">If you have flagged all bombs, you win the game</li>
            <li class="list-group-item">If you open a field with a bomb, you lose the game</li>
        </ol>
  </div>
</template>

<script>
export default {
  name: "GameFunction"
};
</script>

<style scoped>

    /* Heading */
    h2 {
        color: #007bff;
        margin-top: 15px;
    }

    .list-group-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 5px;
        margin-bottom: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .list-group-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    ol.list-group {
        counter-reset: list-counter;
    }

    ol.list-group > li::before {
        counter-increment: list-counter;
        content: counter(list-counter) ". ";
        font-size: 1.5em;
        font-weight: bold;
        color: #007bff;
        margin-right: 10px;
    }

</style>
