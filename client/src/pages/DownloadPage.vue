<template>
  <main class="mx-auto">
    <AppSpinner />
    <p v-show="!loading">{{ id }}</p>
  </main>
</template>

<script>
// import AppSpinner from '@/components/AppSpinner.vue';
export default {
  name: 'DownloadPage',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    // Check if resource exists
    // Check encryption type i.e., password based vs randomly generated
    //  if randomly generated check presence of router hash value
    console.log(this.$router.currentRoute._value.hash);
    //  if password based prompt for password input
    // Start download
  },
  // components: { AppSpinner },
};
</script>
