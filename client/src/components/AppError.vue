<template>
  <transition appear name="slide">
    <aside
      class="absolute top-20 right-10 w-80 border-l-2 border-orange-900 rounded bg-red-300"
    >
      <p class="text-orange-900 p-2">
        <slot />
      </p>
    </aside>
  </transition>
</template>

<script>
export default {
  name: 'AppError',
};
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(5rem);
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-enter-active {
  transition: all 0.2s ease;
}
.slide-leave-active {
  position: absolute;
  transition: all 0.2s ease;
}
</style>
