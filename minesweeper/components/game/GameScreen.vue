<template>
  <div id="background">
    <video autoplay loop muted playsinline>
      <source :src="videoSource" type="video/mp4" />
      Ihr Browser unterstützt das Video-Tag nicht.
    </video>
  </div>
</template>

<script>
export default {
  name: "Background",
  data() {
    return {
      videoSource: new URL('@/assets/Minesweeper.mp4', import.meta.url).href,
    };
  },
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
