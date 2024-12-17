<template>
  <div class="difficulty-selection">
    <button class="btn-custom" @click="setDifficulty('E')">Easy</button>
    <button class="btn-custom" @click="setDifficulty('M')">Medium</button>
    <button class="btn-custom" @click="setDifficulty('H')">Hard</button>
  </div>
</template>

<script>

const backendUrl = 'http://localhost:9000';

export default {
  props: {
    mode: {
      type: String,
      required: true,
    }
  },
  methods: {
    setDifficulty(diff) {

      if(this.mode === 'coop') {
          this.$emit("selectedDifficulty", diff, "coop");
      }

      if(this.mode === 'versus') {
          this.$emit("selectedDifficulty", diff, "versus");
      }

      if(this.mode === 'single') {
        console.log("Setting difficulty level to:", diff);

        // Create URLSearchParams to send as URL-encoded data
        const params = new URLSearchParams();
        params.append('level', diff);

        // Use fetch to send a POST request to set the difficulty
        fetch(`${backendUrl}/game/setDifficulty`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        })
          .then(response => response.json())
          .then( data => {
            console.log('Difficulty set:', data);
            this.$emit("selectedDifficulty", diff, "single");
          })
          .catch(error => {
            console.error('Error setting difficulty:', error);
            alert('Fehler beim Festlegen des Schwierigkeitsgrads. Bitte versuchen Sie es erneut.');
          });
      }
    }
  }
};
</script>

<style scoped>
.difficulty-selection {
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
