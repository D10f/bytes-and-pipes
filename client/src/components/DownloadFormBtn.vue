<template>
  <div>
    <p class="text-gray(-700) mb-4 lg:mb-2">
      {{ fileDetails }}
    </p>
    <!-- <a :href="url" download class="hidden" ref="downloadBtn" /> -->
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
    async startDownload() {
      this.disableBtn = true;
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = this.url;
      // if (!window.TransformStream) {
      //   a.download = this.file.name;
      // }
      a.download = this.file.name;
      a.click();
      // this.$refs['downloadBtn'].click();
    },
  },
};
</script>
