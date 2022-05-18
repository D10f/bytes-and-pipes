<template>
  <main
    class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-2 md:justify-between md:justify-center md:items-center h-full my-6 mb-12"
  >
    <InstructionsList />
    <ControlPanel />
  </main>
</template>

<script>
import InstructionsList from '@/components/InstructionsList.vue';
import ControlPanel from '@/components/ControlPanel.vue';
export default {
  name: 'HomePage',
  components: {
    InstructionsList,
    ControlPanel,
  },
};
</script>
