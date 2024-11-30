<template>
  <div class="difficulty-selection">
    <button class="btn-custom" @click="setDifficulty('easy')">Easy</button>
    <button class="btn-custom" @click="setDifficulty('medium')">Medium</button>
    <button class="btn-custom" @click="setDifficulty('hard')">Hard</button>
  </div>
</template>

<script>
import axios from 'axios';  // Import axios

const backendUrl = 'http://localhost:9000';

export default {
  methods: {
    setDifficulty(diff) {
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
        .then(data => {
          this.$emit("selectedDifficulty", diff);
        })
        .catch(error => {
          console.error('Error setting difficulty:', error);
          alert('Fehler beim Festlegen des Schwierigkeitsgrads. Bitte versuchen Sie es erneut.');
        });
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
