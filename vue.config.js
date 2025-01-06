const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pwa: {
    name: "Minesweeper",
    themeColor: "#4DBA87",
    manifestOptions: {
      short_name: "Minesweeper",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      icons: [
        {
          src: "./src/assets/Mine.png", // Stelle sicher, dass dieser Pfad existiert
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "./src/assets/Mine.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  },
  transpileDependencies: true,
})
