<template>
  <li
    class="text-lg p-2 my-2 rounded border-b-2 opacity-80"
    :class="{
      'bg-gray-400 border-gray-600': isActive,
      'bg-primary-400 border-primary-600 opacity-100': isValid,
      'bg-red-400 border-red-600 opacity-100': isError,
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
