import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles.scss';
import Acco from '@lagabu/acco';
import '@lagabu/theme-default';

createApp(App).use(Acco).mount('#app');
