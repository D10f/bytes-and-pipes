import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Bytes And Pipes - Share files in Privacy',
    },
  },
  {
    path: '/d/:id',
    name: 'Download',
    component: () => import('@/pages/DownloadPage.vue'),
    props: true,
    meta: {
      title: 'Bytes And Pipes - Download File',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue'),
    meta: {
      title: 'Bytes And Pipes - About Us',
    },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/pages/PrivacyPage.vue'),
    meta: {
      title: 'Bytes And Pipes - Privacy Policy',
    },
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/pages/TermsPage.vue'),
    meta: {
      title: 'Bytes And Pipes - Terms And Conditions',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: 'Bytes And Pipes - 404',
    },
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
