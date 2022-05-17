<template>
  <section class="xs:mx-auto lg:mx-0">
    <header class="md:mb-5">
      <h3 class="font-subtitle text-xl md:text-2xl font-bold">
        Share your files in just a few steps:
      </h3>
    </header>
    <ol
      class="list-decimal pl-6"
      :class="{ 'hover:cursor-not-allowed': isUploading }"
    >
      <InstructionsListItem
        v-for="instruction in instructions"
        :key="instruction.title"
        :instruction="instruction"
      />
    </ol>
  </section>
</template>

<script>
import InstructionsListItem from './InstructionsListItem.vue';
export default {
  name: 'InstructionsList',
  components: { InstructionsListItem },
  data() {
    return {
      instructions: this.$store.state.instructions,
    };
  },
  computed: {
    isUploading() {
      return this.$store.state.upload.isUploading;
    },
  },
};
</script>
