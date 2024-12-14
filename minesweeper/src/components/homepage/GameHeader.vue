<template>
  <header id="header-scroll">
    <h1 id="title">Minesweeper</h1>
  </header>
</template>

<script>
export default {
  name: "GameHeader"
};
</script>

<style scoped>
    header {
        color: white;
        padding: 160px 0;
        background-image: url("@/assets/Minesweeper_picture.webp");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
    }

    #title {
        font-size: 6.5rem;
        font-weight: bold;
    }

    #header-scroll {
        transition: height 0.5s ease, padding 0.5s ease;
    }

    #header-scroll.small {
        height: 50px;
        padding: 10px 0;
    }

    #header-scroll h1 {
        transition: font-size 0.3s ease;
    }

    #header-scroll.small h1 {
        font-size: 1.5rem;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        #title {
            font-size: 4rem;
        }

        header {
            padding: 80px 0;
        }
    }

    @media (max-width: 576px) {
        #title {
            font-size: 2.5rem;
        }

        header {
            padding: 60px 0;
        }
    }

</style>
