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
  name: "Function"
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
