import { createStore } from 'vuex';
import { convertBytes } from '@/utils/bytes';
import { shortener } from '@/utils/shortener';

export const store = createStore({
  state: {
    file: null,
    expirationTime: null,
    allowedDownloads: null,
    encryptionStrategy: {
      type: null,
      content: null,
    },
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
        title: 'UPLOAD',
        text: 'Share the file url.',
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
    nextUnfinishedInstruction({ instructions }) {
      return instructions.find(
        (i) => (!i.isCurrent && i.status === 'IDLE') || i.status === 'ERROR'
      );
    },
    isReadyToUpload({
      file,
      expirationTime,
      allowedDownloads,
      encryptionStrategy,
    }) {
      return (
        file && expirationTime && allowedDownloads && encryptionStrategy.type
      );
    },
    fileDetails({ file }) {
      const truncatedFilename = shortener(file.name, {
        headLength: 15,
        tailLength: 10,
      });
      const readableSize = `(${convertBytes(file.size)})`;
      return truncatedFilename + readableSize;
    },
    downloadOptions({ expirationTime, allowedDownloads }) {
      return `Expires in ${expirationTime} hours or after ${allowedDownloads} downloads.`;
    },
    encryptionStrategy({ encryptionStrategy }) {
      return `Encryption strategy: ${encryptionStrategy.type}`;
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
      commit('setCurrentInstruction', getters.nextUnfinishedInstruction.title);
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
      commit('setCurrentInstruction', getters.nextUnfinishedInstruction.title);
    },
    updateEncryptionOptions({ getters, commit }, { useRandomKey, password }) {
      commit('setEncryptionOptions', {
        useRandomKey,
        password,
      });
      commit('setInstructionStatus', {
        instruction: 'ENCRYPTION_OPTIONS',
        status: 'VALID',
        details: getters.encryptionStrategy,
      });
      commit('setCurrentInstruction', getters.nextUnfinishedInstruction.title);
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
    setEncryptionOptions(state, { useRandomKey, password }) {
      state.encryptionStrategy.type = useRandomKey
        ? 'RANDOMLY_GENERATED'
        : 'PASSWORD_BASED';
      state.encryptionStrategy.content = password ? password : null;
    },
  },
});
