<template>
  <div class="options__container relative">
    <p
      v-if="!isReady"
      class="text-gray-700 text-center text-sm mb-4 pointer-events-none"
    >
      Please make sure to complete all the steps to start the upload.
    </p>
    <button :disabled="!isReady" class="action-btn mx-auto">
      Start Upload
    </button>
    <UploadFormOverlay v-if="progress" :progress="progress" />
  </div>
</template>

<script>
import UploadFormOverlay from './UploadFormOverlay.vue';

export default {
  name: 'UploadForm',
  components: { UploadFormOverlay },
  data() {
    return {
      progress: 0,
    };
  },
  computed: {
    isReady() {
      return this.$store.getters.isReadyToUpload;
    },
  },
  methods: {
    startUpload() {
      this.progress = 0;
    },
  },
};
</script>
