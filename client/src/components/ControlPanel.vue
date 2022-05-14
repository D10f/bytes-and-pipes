<template>
  <section class="border-2 border-dashed border-black rounded h-full">
    <DropZone v-if="currentInstruction === 'SELECT_FILE'" />
    <ShareOptions v-if="currentInstruction === 'SHARE_OPTIONS'" />
    <EncryptionOptions v-if="currentInstruction === 'ENCRYPTION_OPTIONS'" />
  </section>
</template>

<script>
import DropZone from './DropZone.vue';
import ShareOptions from './ShareOptions.vue';
import EncryptionOptions from './EncryptionOptions.vue';

export default {
  name: 'ControlPanel',
  components: {
    DropZone,
    ShareOptions,
    EncryptionOptions,
  },
  computed: {
    currentInstruction() {
      return this.$store.getters.currentInstruction.title;
    },
  },
};
</script>
