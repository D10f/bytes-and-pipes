<template>
  <input class="hidden" ref="fileInput" type="file" @change="fileChangeFn" />
  <button :class="classObject" type="button" @click="handleClick">
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
  computed: {
    classObject() {
      return {
        'action-btn': !this.file,
        'text-primary-600 hover:text-primary-500': this.file,
      };
    },
  },
  methods: {
    handleClick() {
      this.$refs['fileInput'].click();
    },
  },
};
</script>
