import { createStore } from 'vuex';
import { getFileDetails } from '@/utils/file';

export const store = createStore({
  state: {
    file: null,
    expirationTime: null,
    allowedDownloads: null,
    upload: {
      isUploading: false,
      done: false,
      url: null,
    },
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
        (i) => !i.isCurrent && (i.status === 'IDLE' || i.status === 'ERROR')
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
  },
  actions: {
    startUpload({ commit }) {
      commit('setUploadStatus', { isUploading: true, done: false, url: null });
    },
    finishUpload({ commit }, url) {
      commit('setUploadStatus', { isUploading: true, done: true, url });
    },
    uploadFailure({ commit }, error) {
      commit('setInstructionStatus', {
        instruction: 'UPLOAD',
        status: 'ERROR',
        details: error,
      });
      commit('setUploadStatus', { isUploading: false, done: false, url: null });
    },
    selectInstruction({ getters, commit }, instruction) {
      if (getters.currentInstruction.title === instruction) {
        return;
      }
      commit('setCurrentInstruction', instruction);
    },
    selectFile({ getters, commit }, file) {
      const error = file.size > process.env.VUE_APP_MAX_FILE_SIZE;

      commit('setFile', error ? null : file);
      commit('setInstructionStatus', {
        instruction: 'SELECT_FILE',
        status: error ? 'ERROR' : 'VALID',
        details: error
          ? `${getFileDetails(file)} exceeds allowed size`
          : getFileDetails(file),
      });

      if (!error) {
        commit(
          'setCurrentInstruction',
          getters.nextUnfinishedInstruction.title
        );
      }
    },
    updateDownloadOptions(
      { getters, commit },
      { expirationTime, allowedDownloads }
    ) {
      commit('setDownloadOptions', { expirationTime, allowedDownloads });
      commit('setInstructionStatus', {
        instruction: 'SHARE_OPTIONS',
        status: 'VALID',
        details: `Expires in ${expirationTime} hours or after ${allowedDownloads} downloads.`,
      });
      commit('setCurrentInstruction', getters.nextUnfinishedInstruction.title);
    },
    updateEncryptionOptions({ getters, commit }, { useRandomKey, password }) {
      const encryptionType = useRandomKey
        ? 'RANDOMLY_GENERATED'
        : 'PASSWORD_BASED';

      commit('setEncryptionOptions', {
        type: encryptionType,
        password,
      });

      commit('setInstructionStatus', {
        instruction: 'ENCRYPTION_OPTIONS',
        status: 'VALID',
        details: `Encryption strategy: ${encryptionType}`,
      });
      commit('setCurrentInstruction', getters.nextUnfinishedInstruction.title);
    },
  },
  mutations: {
    setUploadStatus(state, status) {
      state.upload = status;
    },
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
    setEncryptionOptions(state, { type, password }) {
      state.encryptionStrategy.type = type;
      state.encryptionStrategy.content = password;
    },
  },
});
