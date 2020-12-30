import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.vue';
import Test from './views/Test.vue';
export const Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home,
    },
  ],
});
