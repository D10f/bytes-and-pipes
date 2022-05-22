<template>
  <main class="mx-auto">
    <AppError v-show="error">
      {{ error }}
    </AppError>
    <AppSpinner v-show="loading" />
    <div v-show="allowDownload">
      <DownloadFormUserInput
        v-show="needsUserPassword && !fileMetadata"
        @decrypt="decryptMetadata"
      />

      <DownloadFormBtn
        v-show="fileMetadata && downloadUrl"
        :file="fileMetadata"
        :url="downloadUrl"
      />
    </div>
  </main>
</template>

<script>
import DownloadFormUserInput from '@/components/DownloadFormUserInput.vue';
import DownloadFormBtn from '@/components/DownloadFormBtn.vue';
import {
  PasswordBasedStrategy,
  RandomPasswordStrategy,
} from '@/services/DecryptionService';
import { DownloadService } from '@/services/DownloadService';

export default {
  name: 'DownloadPage',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    DownloadFormUserInput,
    DownloadFormBtn,
  },
  data() {
    return {
      loading: true,
      error: null,
      downloadUrl: null,
      fileMetadata: null,
      allowDownload: true,
    };
  },
  computed: {
    hash() {
      return this.$router.currentRoute._value.hash.slice(1);
    },
    needsUserPassword() {
      return !this.hash;
    },
  },
  methods: {
    async decryptMetadata(password) {
      try {
        const downloadService = new DownloadService(this.id);
        const strategy = new PasswordBasedStrategy(password);
        this.fileMetadata = await downloadService.getFileMetadata(strategy);
        this.downloadUrl = `http://localhost:3000/file/download/${this.id}`;
      } catch (error) {
        this.error = error.message;
        setTimeout(() => {
          this.error = null;
        }, 2000);
      }
    },
  },
  async created() {
    try {
      if (this.needsUserPassword) {
        return;
      }
      const downloadService = new DownloadService(this.id);
      const strategy = new RandomPasswordStrategy(this.hash);
      this.fileMetadata = await downloadService.getFileMetadata(strategy);
      this.downloadUrl = `http://localhost:3000/file/download/${this.id}`;
    } catch (error) {
      this.error = error.message;
      this.allowDownload = false;
    } finally {
      this.loading = false;
    }
  },
};
</script>
