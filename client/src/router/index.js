import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth',
    };
  },
});
