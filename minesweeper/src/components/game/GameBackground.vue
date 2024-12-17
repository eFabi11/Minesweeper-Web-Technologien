<template>
  <div id="background">
    <video autoplay loop muted playsinline>
      <source src="../../assets/Minesweeper.mp4" type="video/mp4" />
    </video>
  </div>
</template>



<script>
export default {
  name: "GameBackground",
};
</script>

<style scoped>
#background video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
</style>
