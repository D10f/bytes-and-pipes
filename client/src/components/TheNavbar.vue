<template>
  <nav
    class="bg-primary-400 border-b-2 border-primary-600 rounded text-center md:text-left"
  >
    <h1 class="font-title text-4xl p-2">
      <router-link :to="{ name: 'Home' }">Bytes And Pipes</router-link>
    </h1>
  </nav>
</template>

<script>
export default {
  name: 'TheNavbar',
};
</script>

<style></style>
