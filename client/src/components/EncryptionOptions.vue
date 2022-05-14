<template>
  <div class="options__container mx-10">
    <div
      class="flex gap-4 justify-between items-center"
      :class="checkboxClassObject"
    >
      <label
        for="randomBased"
        title="Generates an encryption key using cryptographic functions."
      >
        Randomly Generated
        <span class="text-xs text-gray-500 italic">(recommended)</span>
      </label>
      <input
        @change="loadZxcvbn"
        v-model="useRandomKey"
        type="checkbox"
        id="randomBased"
        class="accent-primary-500"
      />
    </div>
    <div
      class="flex flex-col lg:flex-row gap-4 justify-between items-center"
      :class="classObject"
    >
      <label
        for="passwordBased"
        title="Derives an encryption key using password-based key derivation function."
      >
        Password-based
        <span
          v-if="password"
          class="text-xs font-semibold italic"
          :class="passwordStrengthClass"
          >({{ passwordStrength }})</span
        >
      </label>
      <input
        v-model="password"
        type="password"
        class="text-right bg-white border rounded border-gray-400 p-1 focus:outline-none"
        id="passwordBased"
        @input.prevent="getPasswordStrength()"
      />
    </div>
    <button
      @click="updateEncryptionOptions"
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
      password: '',
      passwordStrength: '',
      zxcvbn: null,
    };
  },
  methods: {
    loadZxcvbn() {
      if (!this.zxcvbn) {
        import('zxcvbn').then((m) => {
          this.zxcvbn = m.default;
        });
      }
    },
    getPasswordStrength() {
      const { score } = this.zxcvbn(this.password);
      this.passwordStrength = this.mapPasswordScoreToString(score);
    },
    mapPasswordScoreToString(score) {
      switch (score) {
        case 0:
          return 'weak';
        case 1:
          return 'poor';
        case 2:
          return 'average';
        case 3:
          return 'okay';
        case 4:
          return 'strong';
        default:
          break;
      }
    },
  },
  computed: {
    classObject() {
      return {
        'opacity-20 pointer-events-none': this.useRandomKey,
      };
    },
    checkboxClassObject() {
      return {
        'opacity-20 hover:opacity-100': !this.useRandomKey,
      };
    },
    passwordStrengthClass() {
      return {
        'text-gray-500': this.passwordStrength === 'weak',
        'text-red-500': this.passwordStrength === 'poor',
        'text-amber-500': this.passwordStrength === 'average',
        'text-lime-600': this.passwordStrength === 'okay',
        'text-emerald-600': this.passwordStrength === 'strong',
      };
    },
    isButtonDisabled() {
      return !this.useRandomKey && !this.password;
    },
  },
};
</script>
