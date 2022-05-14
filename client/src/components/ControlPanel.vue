<template>
  <section class="border-2 border-dashed border-black rounded h-32 md:h-full">
    <DropZone v-if="currentInstruction === 'SELECT_FILE'" />
    <ShareOptions v-if="currentInstruction === 'SHARE_OPTIONS'" />
    <!-- <EncryptionOptions v-if="currentInstruction === 'ENCRYPTION_OPTIONS'" /> -->
    <p v-if="currentInstruction === 'ENCRYPTION_OPTIONS'">hello</p>
  </section>
</template>

<script>
import DropZone from './DropZone.vue';
import ShareOptions from './ShareOptions.vue';

export default {
  name: 'ControlPanel',
  components: {
    DropZone,
    ShareOptions,
  },
  computed: {
    currentInstruction() {
      return this.$store.getters.currentInstruction.title;
    },
  },
};
</script>
