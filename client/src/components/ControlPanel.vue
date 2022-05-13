<template>
  <section class="border-2 border-dashed border-black rounded h-32 md:h-full">
    <DropZone v-if="currentStep === 'SELECT_FILE'" />
  </section>
</template>

<script>
import DropZone from './DropZone.vue';
export default {
  name: 'ControlPanel',
  components: {
    DropZone,
  },
  computed: {
    currentStep() {
      return this.$store.getters.currentStep;
    },
  },
};
</script>
