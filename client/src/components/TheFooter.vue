<template>
  <footer class="border-t-2 border-primary-600 pt-2 sm:mt-10 lg:mt-0">
    <ul class="flex justify-between items-center lg:w-1/3 md:ml-auto">
      <li class="footer__link">
        <a href="https://github.com/D10f/bytes-and-pipes">Source Code</a>
      </li>
      <li class="footer__link">
        <router-link :to="{ name: 'About' }">About</router-link>
      </li>
      <li class="footer__link">
        <router-link :to="{ name: 'Privacy' }">Privacy</router-link>
      </li>
      <li class="footer__link">
        <router-link :to="{ name: 'Terms' }">Terms</router-link>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
};
</script>
