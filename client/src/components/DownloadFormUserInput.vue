<template>
  <form
    class="my-5"
    v-show="needsUserPassword && !fileMetadata"
    @submit.prevent="decryptPassword"
  >
    <p class="text-gray-700 mb-4 lg:mb-2">
      Please enter the decryption password to continue.
    </p>
    <div class="flex justify-evenly gap-2">
      <input class="grow px-2" v-model="password" type="password" />
      <button class="action-btn" :disabled="decrypting">Decrypt</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'DownloadFormUserInput',
  data() {
    return {
      password: '',
      decrypting: false,
    };
  },
  methods: {
    decryptPassword() {
      this.$emit('decrypt', this.password);
    },
  },
};
</script>
