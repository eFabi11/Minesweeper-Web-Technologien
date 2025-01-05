<template>
  <div class="mode-selection">
    <button class="btn-custom" @click="selectMode('single')">Single Player</button>
    <button class="btn-custom" @click="selectMode('coop')">Cooperative</button>
    <button class="btn-custom" @click="selectMode('versus')">Versus</button>
  </div>
</template>

<script>
export default {
  methods: {
    selectMode(mode) {
      this.$emit("modeSelected", mode); // Emit the selected mode to the parent component
    },
  },
};
</script>

<style scoped>
.mode-selection {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

/* Button Styling */
.btn-custom {
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #6a7d91; /* Dunkles Grau-Blau */
  border: none;
  color: white;
}

.btn-custom:hover,
.btn-custom:focus {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background-color: #7b8da1; /* Etwas helleres Grau-Blau */
}
</style>
