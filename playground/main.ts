import { createApp } from 'vue';
import App from './App.vue';
import '@lagabu/theme-default';
import './assets/styles.scss';
import Ako from '@lagabu/ako';
import { Router } from './router';

createApp(App)
  .use(Ako, {
    color: {
      basic: {
        'red-0': '#fff',
      },
    },
  })
  .use(Router)
  .mount('#app');
