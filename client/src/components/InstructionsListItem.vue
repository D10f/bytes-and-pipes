<template>
  <li
    class="md:text-lg sm:w-full md:max-w-max text-gray-500 p-2 my-2 rounded opacity-60 hover:cursor-pointer hover:opacity-100"
    :class="classObject"
    @click="selectInstruction"
  >
    {{ text }}
    <p v-if="details" class="text-sm p-2">{{ details }}</p>
  </li>
</template>

<script>
export default {
  name: 'InstructionsListItem',
  props: {
    instruction: Object,
  },
  data() {
    return {
      text: this.instruction.text,
      title: this.instruction.title,
    };
  },
  computed: {
    isCurrent() {
      return this.$store.getters.instruction(this.title).isCurrent;
    },
    isValid() {
      return this.$store.getters.instruction(this.title).status === 'VALID';
    },
    isError() {
      return this.$store.getters.instruction(this.title).status === 'ERROR';
    },
    details() {
      return this.$store.getters.instruction(this.title).details;
    },
    classObject() {
      return {
        'border-l-2 opacity-100': this.isCurrent,
        'border-gray-900 bg-gray-300 text-gray-900 opacity-100':
          this.isCurrent && !this.isValid && !this.isError,
        'border-green-900 bg-primary-400 text-green-900': this.isValid,
        'border-orange-900 bg-red-300 text-orange-900': this.isError,
      };
    },
  },
  methods: {
    selectInstruction() {
      this.$store.dispatch('selectInstruction', this.title);
    },
  },
};
</script>
