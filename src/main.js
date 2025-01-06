import { createApp } from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag';

const app = createApp(App);

app.use(VueGtag, {
  config: { id: "G-XXXXXXXXXX" }, // Replace with your Measurement ID
});

createApp(App).mount('#app')
