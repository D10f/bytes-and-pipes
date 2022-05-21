<template>
  <form
    class="options__container items-center"
    :class="classObject"
    @submit.prevent=""
    @dragover.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <p class="text-gray-700 text-sm mb-4 pointer-events-none">
      {{
        file ? `${fileDetails}` : 'Drag and drop or use the file picker below:'
      }}
    </p>
    <DropZoneFilePicker :file="file" :handleFileChange="handleFileChange" />
  </form>
</template>

<script>
import DropZoneFilePicker from './DropZoneFilePicker.vue';
import { getFileDetails } from '@/utils/file';

export default {
  name: 'DropZone',
  components: { DropZoneFilePicker },
  data() {
    return {
      isDraggedOver: false,
    };
  },
  computed: {
    classObject() {
      return {
        'bg-primary-400 border-primary-500 opacity-50': this.isDraggedOver,
      };
    },
    file() {
      return this.$store.state.file;
    },
    fileDetails() {
      return getFileDetails(this.file);
    },
  },
  methods: {
    handleDragEnter() {
      this.isDraggedOver = true;
    },
    handleDragLeave() {
      this.isDraggedOver = false;
    },
    handleDrop({ dataTransfer }) {
      const file = dataTransfer.files[0];
      this.isDraggedOver = false;
      this.updateFileState(file);
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.updateFileState(file);
    },
    updateFileState(file) {
      console.log(file);
      this.$store.dispatch('selectFile', file);
    },
  },
};
</script>
