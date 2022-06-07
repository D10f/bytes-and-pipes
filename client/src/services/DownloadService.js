import { DecryptionService } from './DecryptionService';
import { parse } from '@/utils/byte_size_parser';

export class DownloadService {
  constructor(resourceId) {
    this._id = resourceId;
    this._metadataEndpoint = `/file/d/meta/${resourceId}`;
    this._downloadEndpoint = `/file/download/${resourceId}`;
    this._decryptionService;
    this._fileMetadata = null;
    // this._validateResourceId(resourceId);
    this._startServiceWorker();
  }

  async getFileMetadata(decryptionStrategy) {
    this._decryptionService = new DecryptionService(decryptionStrategy);
    try {
      const response = await fetch(this._metadataEndpoint);
      if (response.status !== 200) {
        throw new Error('Resource does not exist or has expired.');
      }
      const ciphertext = await response.arrayBuffer();
      const metadata = await this._decryptionService.decrypt(ciphertext);
      const decoded = new TextDecoder().decode(metadata);
      this._fileMetadata = JSON.parse(decoded);
      // await this._startServiceWorker();
      return this._fileMetadata;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Validates the argument id is a valid BSON ObjectId.
   * @param {string} id
   */
  _validateResourceId(id) {
    if (typeof id !== 'string' || new TextEncoder().encode(id).length !== 12) {
      throw new Error('Invalid resource id.');
    }
  }

  /**
   * Starts a new Service Worker that listens for a resource download
   */
  async _startServiceWorker() {
    if (!navigator.serviceWorker) {
      throw new Error('Service Workers are not supported by this browser.');
    }

    try {
      await navigator.serviceWorker.register('/serviceWorker.js');

      setTimeout(() => {
        navigator.serviceWorker.controller.postMessage({
          key: this._decryptionService.key,
          file: this._fileMetadata,
          chunkSize: parse(process.env.VUE_APP_UPLOAD_CHUNK_SIZE),
        });

        window.setInterval(() => {
          navigator.serviceWorker.controller.postMessage('ping');
        }, process.env.VUE_APP_SW_PING_INTERVAL);
      }, 1000);
    } catch (error) {
      console.log(error.message);
      throw new Error(
        'Failed to initialize Service Worker. Please refresh the window and try again.'
      );
    }
  }
}
