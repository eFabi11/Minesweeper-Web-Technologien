import { createApp } from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag';

import { initializeApp } from "firebase/app";

const app = createApp(App);

const firebaseConfig = {
  apiKey: "AIzaSyCgVwv7wtTAW0OsUO-m9oCzxWVUsl1tzgI",
  authDomain: "minesweeper-webapp.firebaseapp.com",
  projectId: "minesweeper-webapp",
  storageBucket: "minesweeper-webapp.firebasestorage.app",
  messagingSenderId: "969443969059",
  appId: "1:969443969059:web:242ba60f34e87523560996",
  measurementId: "G-3DY8JM4KP6"
};

initializeApp(firebaseConfig);

app.use(VueGtag, {
  config: { id: "G-XXXXXXXXXX" }, // Replace with your Measurement ID
});

createApp(App).mount('#app')
