<template>
  <div class="mode-selection">
    <button @click="selectMode('single')">Single Player</button>
    <button @click="selectMode('coop')">Cooperative</button>
    <button @click="selectMode('versus')">Versus</button>
  </div>
</template>

<script>
export default {
  methods: {
    selectMode(mode) {
      if (mode === 'single') {
        $('#singleMode').click(); // Löst den bestehenden Event-Listener aus
      } else if (mode === 'coop') {
        $('#coopMode').click(); // Löst den bestehenden Event-Listener aus
      } else if (mode === 'versus') {
        $('#vsMode').click(); // Löst den bestehenden Event-Listener aus
      }
    },
  },
};
</script>

<style scoped>

    @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

    .btn-custom {
        padding: 0.75rem 1.5rem;
        font-size: 1.25rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        background-color: #6a7d91; /* Dunkles Grau-Blau */
        border: none;
        color: white;
    }

    .btn-custom:hover, .btn-custom:focus {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        background-color: #7b8da1; /* Etwas helleres Grau-Blau */
    }

</style>
