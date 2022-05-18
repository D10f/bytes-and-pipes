import { createApp } from 'vue';
import { router } from '@/router';
import { store } from '@/store';
import AppSpinner from '@/components/AppSpinner.vue';

import App from './App.vue';

import './main.css';

const app = createApp(App);

app.component('AppSpinner', AppSpinner).use(router).use(store).mount('#app');
