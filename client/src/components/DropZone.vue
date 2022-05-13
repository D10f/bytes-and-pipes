<template>
  <form
    class="h-full flex flex-col justify-center items-center"
    :class="{ 'bg-primary-400 border-primary-500 opacity-50': isDraggedOver }"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <p class="text-gray-700 text-sm mb-4 pointer-events-none" v-if="!file">
      Drag and drop or use the file picker below:
    </p>
    <DropZoneFilePicker :file="file" :handleFileChange="handleFileChange" />
  </form>
</template>

<script>
import DropZoneFilePicker from './DropZoneFilePicker.vue';

export default {
  name: 'DropZone',
  components: { DropZoneFilePicker },
  data() {
    return {
      isDraggedOver: false,
      file: null,
    };
  },
  methods: {
    handleDragEnter() {
      this.isDraggedOver = true;
    },
    handleDragLeave({ relatedTarget }) {
      if (
        (relatedTarget && relatedTarget.localName === 'button') ||
        relatedTarget.localName === 'form'
      ) {
        return;
      }
      this.isDraggedOver = false;
    },
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      console.log(file);
    },
    handleFileChange(event) {
      console.log(event.target.files[0]);
    },
  },
};
</script>
