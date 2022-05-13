<template>
  <main class="grid grid-cols-2 gap-x-2 justify-center items-center">
    <InstructionsList />
    <div class="w-full">
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
    </div>
  </main>
</template>

<script>
import InstructionsList from '@/components/InstructionsList.vue';
export default {
  name: 'HomePage',
  components: {
    InstructionsList,
  },
};
</script>
