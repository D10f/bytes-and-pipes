<template>
  <div class="options__container mx-10">
    <div class="flex gap-4 justify-between items-center">
      <label
        for="randomBased"
        title="Generates an encryption key using cryptographic functions."
      >
        Randomly Generated
        <span class="text-xs text-gray-500 italic">(recommended)</span>
      </label>
      <input
        v-model="useRandomKey"
        type="checkbox"
        class="options-input"
        id="randomBased"
      />
    </div>
    <div class="flex gap-4 justify-between items-center" :class="classObject">
      <label
        for="passwordBased"
        title="Derives an encryption key using password-based key derivation function."
        >Password-based</label
      >
      <input
        v-model="password"
        class="options-input"
        id="passwordBased"
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
export default {
  name: 'EncryptionOptions',
  data() {
    return {
      useRandomKey: true,
    };
  },
  computed: {
    classObject() {
      return {
        'opacity-20 pointer-events-none': this.useRandomKey,
      };
    },
  },
};
</script>
