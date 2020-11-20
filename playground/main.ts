import { createApp } from 'vue';
import App from './App.vue';
import Ako from 'ako-ui';
import { Router } from './router';

createApp(App).use(Router).use(Ako).mount('#app');
