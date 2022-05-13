import { createStore } from 'vuex';

export const store = createStore({
  state: {
    instructions: [
      {
        id: (Math.random() * 1000).toString(),
        title: 'SELECT_FILE',
        text: '1. Select a file of up to 1GB.',
        status: 'ACTIVE', // ACTIVE, IDLE, VALID, ERROR
      },
      {
        id: (Math.random() * 1000).toString(),
        title: 'ENCRYPTION_STRAT',
        text: '2. Choose and encryption strategy.',
        status: 'IDLE',
      },
      {
        id: (Math.random() * 1000).toString(),
        title: 'SHARE',
        text: '3. Share the url.',
        status: 'IDLE',
      },
    ],
  },
  getters: {
    currentStep({ instructions }) {
      const { title } = instructions.find((i) => i.status === 'ACTIVE');
      return title;
    },
  },
  actions: {},
  mutations: {},
});
