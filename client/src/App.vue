<template>
  <body
    class="bg-gray-100 min-h-screen p-12 flex flex-col justify-between align-stretch"
  >
    <TheNavbar />
    <router-view></router-view>
    <TheFooter />
  </body>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue';
import TheFooter from '@/components/TheFooter.vue';

export default {
  name: 'App',
  components: {
    TheNavbar,
    TheFooter,
  },
};
</script>
