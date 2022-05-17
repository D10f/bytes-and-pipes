<template>
  <aside
    class="absolute top-0 left-0 w-full h-full bg-white/95 flex flex-col justify-center items-center text-back font-subtitle text-gray-700"
  >
    <div v-if="!done" class="text-center">
      <p class="mb-2 text-4xl">{{ progress }}%</p>
      <p>Please don't close or refresh this window.</p>
    </div>
    <div v-else class="text-center mx-8">
      <p class="mb-2 xl:text-lg text-left">
        <span class="block text-gray-600 italic text-sm"
          >Your Download Link:</span
        >
        <span class="my-4 text-center border-b-2 border-primary-400">{{
          url
        }}</span>
      </p>
      <p class="text-gray-600 italic text-left text-sm mb-4">
        You can now copy this link and share with anyone you want. Make sure to
        read through the encryption strategies section to understand how this
        works and what are the advantages of using the different approaches
        available.
      </p>
      <p class="text-gray-600 italic text-left text-sm mb-4">
        Please refresh this page if you want to upload another file.
      </p>
      <button @click="copyToClipboard" class="action-btn" ref="copyBtn">
        Copy Link
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'UploadFormOverlay',
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
  computed: {
    done() {
      return this.$store.state.upload.done;
    },
    url() {
      return this.$store.state.upload.url;
    },
  },
  methods: {
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.url);
      this.$refs['copyBtn'].textContent = 'Copied!';
      setTimeout(() => {
        this.$refs['copyBtn'].textContent = 'Copy Link';
      }, 1000);
    },
  },
};
</script>
