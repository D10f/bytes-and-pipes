<template>
  <main class="mx-auto">
    <AppSpinner />
    <p v-show="!loading">{{ id }}</p>
  </main>
</template>

<script>
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
    console.log(this.id);
    // Check if resource exists
    // Check encryption type i.e., password based vs randomly generated
    //  if randomly generated check presence of router hash value
    console.log(this.$router.currentRoute._value.hash.slice(1));
    //  if password based prompt for password input
    // Start download
  },
  // components: { AppSpinner },
};
</script>
