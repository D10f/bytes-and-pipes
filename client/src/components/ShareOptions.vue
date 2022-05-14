<template>
  <div class="options__container mx-10">
    <div class="relative flex gap-4 justify-between items-center">
      <label
        for="expirationTime"
        title="Hours until this file expires (max 24 hours)"
        >Expiration Time</label
      >
      <input
        v-model="expirationTime"
        class="options-input"
        id="expirationTime"
        placeholder="24"
      />
      <span
        class="absolute top-6 italic text-sm text-gray-500 opacity-50 hover:opacity-100 hover:cursor-default"
        >Hours until this file expires</span
      >
    </div>
    <div class="relative flex gap-4 justify-between items-center">
      <label
        for="allowedDownloads"
        title="Number of downloads allowed for this file (max 5 downloads)"
        >Allowed Downloads</label
      >
      <input
        v-model="allowedDownloads"
        class="options-input"
        id="allowedDownloads"
        placeholder="1"
      />
      <span
        class="absolute top-6 italic text-sm text-gray-500 opacity-50 hover:opacity-100 hover:cursor-default"
        >Number of downloads allowed for this file</span
      >
    </div>
    <button
      @click="updateDownloadOptions"
      class="action-btn"
      :class="{ 'mx-auto': true }"
      :disabled="isButtonDisabled"
    >
      Next
    </button>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, between } from '@vuelidate/validators';

export default {
  name: 'ShareOptions',
  data() {
    return {
      v$: useVuelidate(),
      expirationTime: '',
      allowedDownloads: '',
    };
  },
  validations() {
    return {
      expirationTime: {
        required,
        betweenValue: between(1, 24),
      },
      allowedDownloads: {
        required,
        betweenValue: between(1, 5),
      },
    };
  },
  computed: {
    isButtonDisabled() {
      return this.v$.$error;
    },
  },
  methods: {
    updateDownloadOptions() {
      this.$store.dispatch('updateDownloadOptions', {
        expirationTime: this.expirationTime,
        allowedDownloads: this.allowedDownloads,
      });
    },
  },
  mounted() {
    this.v$.$validate();
  },
};
</script>
