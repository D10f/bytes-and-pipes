<template>
  <div class="options__container relative">
    <p
      v-if="!isReady"
      class="text-gray-700 text-center text-sm mb-4 pointer-events-none"
    >
      Please make sure to complete all the steps to start the upload.
    </p>
    <button
      @click="startUpload"
      :disabled="!isReady || isUploading"
      class="action-btn mx-auto"
    >
      Start Upload
    </button>
    <UploadFormOverlay v-if="isUploading" :progress="progress" />
  </div>
</template>

<script>
import UploadFormOverlay from '@/components/UploadFormOverlay.vue';
import {
  EncryptionService,
  PasswordBasedStrategy,
  RandomPasswordStrategy,
} from '@/services/EncryptionService';
import { UploadService } from '@/services/UploadService';

export default {
  name: 'UploadForm',
  components: { UploadFormOverlay },
  data() {
    return {
      progress: 0,
      url: undefined,
    };
  },
  computed: {
    isReady() {
      return this.$store.getters.isReadyToUpload;
    },
    isUploading() {
      return this.$store.state.upload.isUploading;
    },
  },
  methods: {
    async startUpload() {
      this.$store.dispatch('startUpload');

      const file = this.$store.state.file;
      const { type, content } = this.$store.state.encryptionStrategy;

      const EncryptionStrategy =
        type === 'RANDOMLY_GENERATED'
          ? new RandomPasswordStrategy()
          : new PasswordBasedStrategy(content);

      const uploadService = await new UploadService(
        file,
        new EncryptionService(EncryptionStrategy)
      );

      try {
        for await (const { progress, url } of uploadService.start()) {
          this.progress = Math.round(progress);
          if (url) {
            this.$store.dispatch('finishUpload', url);
          }
        }
      } catch (error) {
        this.$store.dispatch('uploadFailure', error.message);
      }
    },
  },
};
</script>
