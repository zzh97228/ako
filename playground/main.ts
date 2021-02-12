import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles.scss';
import Ako from '@lagabu/ako';
import '@lagabu/theme-default';

createApp(App).use(Ako).mount('#app');
