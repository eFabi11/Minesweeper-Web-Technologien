<template>
  <div id="log-out">
    <h1 class="my-4">
      <button
        id="log-out-btn"
        class="btn log-out-btn"
        @click="logOut">
        Log Out
      </button>
    </h1>
  </div>
</template>

<script>
export default {
  methods: {
    logOut() {
      this.$emit('log-out');
    },
  },
};
</script>

<style scoped>

    .log-out-btn {
        font-size: 1.8rem;
        padding: 12px 24px;
        border-radius: 8px;
        background-color: #dc143c;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        transition: background-color 0.5s, transform 0.5s;
    }

    .log-out-btn:hover {
        background-color: #d3003f;
        transform: scale(1.15);
    }

    @media (max-width: 768px) {
        .log-out-btn {
            font-size: 1.5rem;
            padding: 8px 16px;
        }
    }

    @media (max-width: 576px) {
        .log-out-btn {
            font-size: 1.2rem;
            padding: 6px 12px;
        }
    }

</style>