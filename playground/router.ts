import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.vue';
import Btn from './views/Button.vue';
import Grid from './views/Grid.vue';

export const Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home,
    },
    {
      name: 'Btn',
      path: '/btn',
      component: Btn,
    },
    {
      name: 'Grid',
      path: '/grid',
      component: Grid,
    },
  ],
});
