import * as CryptoService from '@utils/crypto';
import { UPLOAD_CHUNK_SIZE, RANDOM_SALT_LENGTH, BASE_API_ENDPOINT } from '@utils/constants';

interface ResponseObject {
  url: string;
  id: string;
}

enum encryptionStrat {
  PASSWORD_BASED = 'PASSWORD_BASED',
  RANDOMLY_GENERATED = 'RANDOMLY_GENERATED'
}

type ArrayBufferGenerator = () => Generator<Promise<ArrayBuffer | Uint8Array>, void, unknown>
type ArrayBufferAsyncGenerator = () => AsyncGenerator<Uint8Array, void, unknown>;

class UploadService {

  private readonly file: File;
  private readonly totalChunks: number;
  private readonly salt: Uint8Array;
  private readonly headers: Headers;
  private key: CryptoKey | undefined;
  private currentChunk: number;
  private hashedFileName: string | undefined;
  private responseObject: ResponseObject | undefined;
  private encryptionStrat: encryptionStrat | undefined;

  constructor(file: File) {
    this.file = file;
    this.currentChunk = 1;
    this.salt = CryptoService.generateRandomValues(RANDOM_SALT_LENGTH);
    this.totalChunks = Math.ceil(file.size / UPLOAD_CHUNK_SIZE);

    this.headers = new Headers({
      "Access-Control-Request-Headers": "Content-type,Content-parts,Content-filesize",
      "Content-Type": "application/octet-stream",
      "Content-parts": `${this.totalChunks}`,
      "Content-filesize": `${this.file.size}`,
    });

    this.hashFileName();
  }

  async encryptMetadata() {
    const fileMetadata = JSON.stringify({
      name: this.file.name,
      size: this.file.size,
      type: this.file.type,
      chunkSize: UPLOAD_CHUNK_SIZE
    });

    const encryptedMetadata = await CryptoService.encryptData(
      new TextEncoder().encode(fileMetadata),
      this.key!,
      this.salt
    );

    return await this.put(encryptedMetadata);
  }

  createEncryptionStream() {
    if (!this.key) {
      throw new Error('You must choose an encryption strategy.');
    }
    const readStream = this.readChunk(this.file);
    const encryptStream = this.encryptChunk(readStream, this.key);
    const uploadStream = this.uploadChunk(encryptStream);
    return uploadStream;
  }

  async withRandomKey() {
    this.key = await CryptoService.generateEncryptionKey();
    this.encryptionStrat = encryptionStrat.RANDOMLY_GENERATED;
    return this;
  }

  async withPassword(password: string) {
    this.key = await CryptoService.deriveEncryptionKey(password, this.salt);
    this.encryptionStrat = encryptionStrat.PASSWORD_BASED;
    return this;
  }

  async hashFileName() {
    const result = await CryptoService.sha256sum(this.file.name + `${Date.now()}`);
    this.hashedFileName = result;
  }

  uploadChunk(g: ArrayBufferAsyncGenerator) {
    const { post } = this;
    return async function*() {
      for await (const chunk of g()) {
        yield post(chunk);
      }
    }
  }

  encryptChunk(g: ArrayBufferGenerator, key: CryptoKey) {
    const { salt } = this;
    return async function*() {
      for await (const chunk of g()) {
        yield CryptoService.encryptData(chunk, key, salt);
      }
    }
  }

  readChunk(file: File): ArrayBufferGenerator {
    let offset = 0;
    return function*(){
      while (offset <= file.size) {
        const chunk = file.slice(offset, offset + UPLOAD_CHUNK_SIZE);
        offset += UPLOAD_CHUNK_SIZE;
        yield chunk.arrayBuffer();
      }
    }
  }

  async post(payload: ArrayBuffer | Uint8Array) {

    const endpoint = BASE_API_ENDPOINT +
      `/upload${this.hashedFileName}/${this.currentChunk}`;

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      body: payload,
      headers: this.headers
    });

    // TODO: Maybe change to json
    if (!apiResponse.ok) {
      const message = await apiResponse.text();
      throw new Error(message);
    }

    if (apiResponse.status === 201) {
      this.responseObject = await apiResponse.json();

      return {
        progress: 100,
        url: this.responseObject?.url
      }
    }

    return {
      progress: (this.currentChunk++ * 100) / this.totalChunks,
      url: undefined
    };
  }

  async put(payload: Uint8Array) {

    let { url, id } = this.responseObject!;

    const endpoint = BASE_API_ENDPOINT +
      `/u/meta/${id}`;

    await fetch(endpoint, {
      method: 'PUT',
      body: payload,
      headers: this.headers
    });

    if (this.encryptionStrat === 'RANDOMLY_GENERATED') {
      url = await CryptoService.generateShareableUrl(url, this.key!);
    }

    return url;
  }
}

export default UploadService;
