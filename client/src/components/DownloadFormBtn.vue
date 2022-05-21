<template>
  <div>
    <p class="text-gray-700 mb-4 lg:mb-2">
      {{ file }}
    </p>
    <a :href="url" ref="downloadBtn" class="hidden" />
    <button @click="startDownload" :disabled="disableBtn" class="action-btn">
      Start Download
    </button>
  </div>
</template>

<script>
export default {
  name: 'DownloadFormBtn',
  props: {
    url: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
  },
  data() {
    return {
      disableBtn: false,
    };
  },
  methods: {
    startDownload() {
      this.disableBtn = true;
      this.$refs['downloadBtn'].click();
    },
  },
};
</script>
