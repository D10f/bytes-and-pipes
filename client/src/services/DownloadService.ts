import * as CryptoService from '@utils/crypto';
import { SW_PING_INTERVAL } from '@utils/constants';

interface IFileMetadata {
  name: string;
  size: number;
  type: string;
  chunkSize: number;
}

class DownloadService {
  private readonly url: URL;
  private key: CryptoKey | undefined;
  private swPingInterval: number | undefined;
  public fileMetadata: IFileMetadata | ArrayBuffer | undefined;

  constructor(url: string) {
    this.url = new URL(url);
  }

  get hasKey() {
    return Boolean(this.key);
  }

  get urlFragment() {
    return this.url.hash.slice(1);
  }

  get fileId() {
    // Assumes structure: http://localhost/file/d/123#urlfragment
    const fileId = this.url.href.match(/\d\/(\w*)(#\w)*?$/i);
    return fileId || '';
  }

  get downloadUrl() {
    return `${this.url.origin}/download/${this.fileId}`;
  }

  async fetchMetadata() {

    if (this.fileMetadata) {
      console.log('file metadata already downloaded, skipping...');
      return null;
    }

    const fileId = this.fileId;

    if (!fileId) {
      throw new Error('Invalid download URL provided');
    }

    const url = `${this.url.href}/file/d/meta/${fileId}`;
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error('File does not exist or has expired.');
    }

    this.fileMetadata = await response.arrayBuffer();
  }

  async decryptMetadata(password = '') {
    if (!this.fileMetadata || !(this.fileMetadata instanceof ArrayBuffer)) {
      throw new Error('No metadata found for this file.');
    }
    const { buffer, key } = await CryptoService.decryptData(this.fileMetadata, password, this.urlFragment);
    this.key = key;
    this.fileMetadata = JSON.parse(new TextDecoder().decode(buffer));
  }

  async startDownloadStream() {
    if (!navigator.serviceWorker) {
      throw new Error('Service Workers not supported by browser.');
    }

    await navigator.serviceWorker.register('/serviceWorker.js');
    navigator.serviceWorker.controller?.postMessage({});

    this.swPingInterval = window.setInterval(() => {
      navigator.serviceWorker.controller?.postMessage('ping');
    }, SW_PING_INTERVAL);
  }

  tearDownStream() {
    clearInterval(this.swPingInterval);
    navigator.serviceWorker.getRegistrations()
      .then(registrations => registrations.forEach(sw => sw.unregister()));
  }
}

export default DownloadService;
