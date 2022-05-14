import { createStore } from 'vuex';

export const store = createStore({
  state: {
    file: null,
    instructions: [
      {
        title: 'SELECT_FILE',
        text: '1. Select a file of up to 1GB.',
        isCurrent: true,
        status: 'IDLE',
        details: '',
      },
      {
        title: 'SHARE_OPTIONS',
        text: '2. Choose download options.',
        isCurrent: false,
        status: 'IDLE',
        details: '',
      },
      {
        title: 'ENCRYPTION_OPTIONS',
        text: '3. Choose an encryption strategy.',
        isCurrent: false,
        status: 'IDLE',
        details: '',
      },
      {
        title: 'UPLOADING',
        text: '4. Upload.',
        status: 'IDLE',
        details: '',
      },
    ],
  },
  getters: {
    instruction: (state) => (title) =>
      state.instructions.find((i) => i.title === title),
    currentInstruction({ instructions }) {
      return instructions.find((i) => i.isCurrent);
    },
    // TODO: Truncate name
    truncatedFilename({ file }) {
      return file.name;
    },
    // TODO: Make size human-readable
    filesizeReadable({ file }) {
      return file.size;
    },
  },
  actions: {
    selectInstruction({ getters, commit }, instruction) {
      if (getters.currentInstruction.title === instruction) {
        return;
      }
      commit('setCurrentInstruction', instruction);
    },
    selectFile({ commit }, file) {
      commit('setFile', file);
      commit('setCurrentInstruction', 'SHARE_OPTIONS');
    },
  },
  mutations: {
    setCurrentInstruction(state, instruction) {
      state.instructions = state.instructions.map((i) => ({
        ...i,
        isCurrent: i.title === instruction,
      }));
    },
    setFile(state, file) {
      state.file = file;
    },
    setError(state, { step, details }) {
      state.instructions = state.instructions.map((i) => {
        return i.title === step ? { ...i, status: 'ERROR', details } : i;
      });
    },
  },
});
