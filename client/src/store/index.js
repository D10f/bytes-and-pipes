import { createStore } from 'vuex';

export const store = createStore({
  state: {
    file: null,
    expirationTime: null, // 1-24
    allowedDownloads: null, // 1-5
    encryptionStrategy: null, // random or password
    instructions: [
      {
        title: 'SELECT_FILE',
        text: 'Select a file of up to 1GB.',
        isCurrent: true,
        status: 'IDLE',
        details: '',
      },
      {
        title: 'SHARE_OPTIONS',
        text: 'Choose download options.',
        isCurrent: false,
        status: 'IDLE',
        details: '',
      },
      {
        title: 'ENCRYPTION_OPTIONS',
        text: 'Choose an encryption strategy.',
        isCurrent: false,
        status: 'IDLE',
        details: '',
      },
      {
        title: 'UPLOADING',
        text: 'Upload.',
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
    truncatedFilename({ file }) {
      // TODO: Truncate name
      return file.name;
    },
    filesizeReadable({ file }) {
      // TODO: Make size human-readable
      return file.size;
    },
    fileDetails({ file }) {
      // TODO: return truncated file name + human readable file size
      return `${file.name} (${file.size})`;
    },
    downloadOptions({ expirationTime, allowedDownloads }) {
      return `Expires in ${expirationTime} hours or after ${allowedDownloads} downloads.`;
    },
  },
  actions: {
    selectInstruction({ getters, commit }, instruction) {
      if (getters.currentInstruction.title === instruction) {
        return;
      }
      commit('setCurrentInstruction', instruction);
    },
    selectFile({ getters, commit }, file) {
      commit('setFile', file);
      commit('setInstructionStatus', {
        instruction: 'SELECT_FILE',
        status: 'VALID',
        details: getters.fileDetails,
      });
      commit('setCurrentInstruction', 'SHARE_OPTIONS');
    },
    updateDownloadOptions(
      { getters, commit },
      { expirationTime, allowedDownloads }
    ) {
      commit('setDownloadOptions', { expirationTime, allowedDownloads });
      commit('setInstructionStatus', {
        instruction: 'SHARE_OPTIONS',
        status: 'VALID',
        details: getters.downloadOptions,
      });
      commit('setCurrentInstruction', 'ENCRYPTION_OPTIONS');
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
    setInstructionStatus(state, { instruction, status, details }) {
      state.instructions = state.instructions.map((i) => {
        return i.title === instruction ? { ...i, status, details } : i;
      });
    },
    setDownloadOptions(state, { expirationTime, allowedDownloads }) {
      state.expirationTime = expirationTime;
      state.allowedDownloads = allowedDownloads;
    },
  },
});
