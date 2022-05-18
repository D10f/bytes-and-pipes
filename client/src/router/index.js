import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/d/:id',
    name: 'Download',
    component: () => import('@/pages/DownloadPage.vue'),
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/pages/PrivacyPage.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/pages/TermsPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'navigation-active-link',
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth',
    };
  },
});
