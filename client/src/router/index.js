import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage';
import DownloadPage from '@/pages/DownloadPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/d/:id',
    name: 'Download',
    component: DownloadPage,
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPage,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsPage,
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
