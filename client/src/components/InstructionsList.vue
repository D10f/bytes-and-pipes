<template>
  <section>
    <header class="md:mb-5">
      <h3 class="font-subtitle text-2xl font-bold">
        Share your files in privacy:
      </h3>
    </header>
    <ol>
      <InstructionsListItem
        v-for="instruction in instructions"
        :key="instruction.id"
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
};
</script>
