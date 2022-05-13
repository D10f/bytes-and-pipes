<template>
  <TheNavbar />
  <router-view></router-view>
  <TheFooter />
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
