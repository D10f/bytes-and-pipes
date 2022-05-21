<template>
  <div>
    <p class="text-gray(-700) mb-4 lg:mb-2">
      {{ fileDetails }}
    </p>
    <a :href="url" :download="file?.name" class="hidden" ref="downloadBtn" />
    <button @click="startDownload" :disabled="disableBtn" class="action-btn">
      Start Download
    </button>
  </div>
</template>

<script>
import { getFileDetails } from '@/utils/file';

export default {
  name: 'DownloadFormBtn',
  props: {
    url: String,
    file: Object,
  },
  data() {
    return {
      disableBtn: false,
    };
  },
  computed: {
    fileDetails() {
      return getFileDetails(this?.file);
    },
  },
  methods: {
    startDownload() {
      this.disableBtn = true;
      this.$refs['downloadBtn'].click();
    },
  },
};
</script>
