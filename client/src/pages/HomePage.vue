<template>
  <main
    class="gap-64 md:grid md:grid-cols-2 md:gap-x-2 md:justify-between md:justify-center md:items-center"
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
