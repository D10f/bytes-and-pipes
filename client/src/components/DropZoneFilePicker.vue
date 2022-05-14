<template>
  <input class="hidden" ref="fileInput" type="file" @change="fileChangeFn" />
  <button class="action-btn" type="button" @click="handleClick">
    {{ file ? 'Change File' : 'Select' }}
  </button>
</template>

<script>
export default {
  name: 'DropZoneFilePicker',
  props: {
    handleFileChange: {
      type: Function,
      required: true,
    },
    file: {
      type: Object,
    },
  },
  data() {
    return {
      fileChangeFn: this.handleFileChange,
    };
  },
  methods: {
    handleClick() {
      this.$refs['fileInput'].click();
    },
  },
};
</script>
