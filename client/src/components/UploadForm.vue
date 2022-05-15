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
      :disabled="!isReady"
      class="action-btn mx-auto"
    >
      Start Upload
    </button>
    <UploadFormOverlay v-if="progress" :progress="progress" />
  </div>
</template>

<script>
import UploadFormOverlay from '@/components/UploadFormOverlay.vue';

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
  },
  methods: {
    async startUpload() {
      this.progress = 12;
      const uploadService = await this.$store.dispatch('getUploadService');
      for await (const chunk of uploadService.start()) {
        console.log(new TextDecoder().decode(chunk));
      }
    },
  },
};
</script>
