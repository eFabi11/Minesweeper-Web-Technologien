<template>
    <div id="video-background">
        <video autoplay loop muted playsinline>
            <source src="../../app/assets/Minesweeper.mp4" type="video/mp4">
            Ihr Browser unterstützt das Video-Tag nicht.
        </video>
    </div>
</template>

<style scoped>

    /* Video Background */
    #video-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
    }

    #video-background video {
        position: absolute;
        top: 50%;
        left: 50%;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: -1;
        transform: translate(-50%, -50%);
        object-fit: cover;
        opacity: 0.8;
    }
</style>
