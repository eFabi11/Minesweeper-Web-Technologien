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
          src: "./src/assets/Mine.png", // Make sure this path exists
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
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000', // Your backend server address during local development
        changeOrigin: true, // Ensures the origin is changed when making the request
        pathRewrite: {
          '^/api': '' // Removes the /api prefix if necessary
        }
      },
      '/game': {
        target: 'http://localhost:9000', // Your backend server address during local development
        changeOrigin: true, // Ensures the origin is changed when making the request
        pathRewrite: {
          '^/game': '' // Removes the /game prefix if necessary
        }
      }
    }
  }
})
