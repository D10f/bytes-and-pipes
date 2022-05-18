<template>
  <body class="bg-gray-100">
    <div
      class="min-h-screen p-4 sm:p-8 md:p-12 mx-auto flex flex-col justify-between align-stretch max-w-screen-xl"
    >
      <TheNavbar />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
      <TheFooter />
    </div>
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

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-in;
}
</style>
