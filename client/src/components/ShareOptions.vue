<template>
  <div class="options__container mx-10">
    <div class="flex gap-4 justify-between items-center">
      <label
        for="expirationTime"
        title="Hours until this file expires (max 24 hours)"
      >
        Expiration Time
        <span class="text-xs text-gray-500 italic">(24 hours max)</span>
      </label>
      <input
        v-model="expirationTime"
        class="options-input"
        id="expirationTime"
        placeholder="24"
      />
    </div>
    <div class="flex gap-4 justify-between items-center">
      <label
        for="allowedDownloads"
        title="Number of downloads allowed for this file (max 5 downloads)"
      >
        Allowed Downloads
        <span class="text-xs text-gray-500 italic">(5 downloads max)</span>
      </label>
      <input
        v-model="allowedDownloads"
        class="options-input"
        id="allowedDownloads"
        placeholder="1"
      />
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
      expirationTime: this.$store.state.expirationTime,
      allowedDownloads: this.$store.state.allowedDownloads,
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
