<template>
  <li
    class="md:text-lg max-w-max text-gray-500 p-2 my-2 rounded"
    :class="{
      'bg-gray-300 text-gray-900': isActive,
      'bg-primary-400 text-green-900': isValid,
      'bg-red-300 text-orange-900': isError,
    }"
  >
    {{ text }}
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
      id: this.instruction.id,
      text: this.instruction.text,
      status: this.instruction.status,
    };
  },
  computed: {
    isActive() {
      return this.status === 'ACTIVE';
    },
    isValid() {
      return this.status === 'VALID';
    },
    isError() {
      return this.status === 'ERROR';
    },
  },
};
</script>
