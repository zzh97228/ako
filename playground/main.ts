import { createApp } from 'vue';
import App from './App.vue';
import { install } from '/src/index';
import '@lagabu/theme-default';
import { Router } from './router';

createApp(App).use(Router).mount('#app');
