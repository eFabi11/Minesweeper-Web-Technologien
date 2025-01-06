import { createApp } from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
