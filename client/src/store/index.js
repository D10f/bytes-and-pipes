import { createStore } from 'vuex';

export const store = createStore({
  state: {
    instructions: [
      {
        id: (Math.random() * 1000).toString(),
        text: '1. Select a file of up to 1GB.',
        status: 'VALID', // ACTIVE, IDLE, VALID, ERROR
      },
      {
        id: (Math.random() * 1000).toString(),
        text: '2. Choose and encryption strategy.',
        status: 'ACTIVE',
      },
      {
        id: (Math.random() * 1000).toString(),
        text: '3. Share the url.',
        status: 'IDLE',
      },
    ],
  },
  getters: {},
  actions: {},
  mutations: {},
});
