export class UploadService {
  constructor(file, encryptionService) {
    this._file = file;
    this._encryptionService = encryptionService;

    this._currentChunk = 1;
    this._totalChunks = Math.ceil(
      file.size / process.env.VUE_APP_UPLOAD_CHUNK_SIZE
    );

    this._headers = new Headers({
      'Access-Control-Request-Headers':
        'Content-type,Content-parts,Content-filesize',
      'Content-Type': 'application/octet-stream',
      'Content-parts': `${this._totalChunks}`,
      'Content-filesize': `${this._file.size}`,
    });

    this._uploadId = encryptionService.sha256sum(
      `${this._file.name}${Date.now()}`
    );
  }

  async post(payload) {
    const endpoint =
      process.env.VUE_APP_BASE_URL +
      `/upload/${this.uploadId}/${this._currentChunk}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: payload,
      headers: this._headers,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }

    if (response.status === 201) {
      this.responseObj = await response.json();

      return {
        progress: 100,
        url: this.responseObj.url,
      };
    }

    return {
      progress: (this._currentChunk * 100) / this.totalChunk,
      url: undefined,
    };
  }

  async put(payload) {
    let { url, id } = this.responseObj;

    const endpoint = process.env.VUE_APP_BASE_URL + `/u/meta/${id}`;

    await fetch(endpoint, {
      method: 'PUT',
      body: payload,
      headers: this._headers,
    });

    return this._encryptionService.strategy === 'RANDOMLY_GENERATED'
      ? await this._encryptionService.generateShareableUrl(url)
      : url;
  }

  createUploadStream() {
    const { uploadStream, encryptChunk, readChunk } = this;
    return uploadStream(encryptChunk(readChunk()));
  }

  readChunk() {
    let offset = 0;
    return async function* () {
      while (offset <= this._file.size) {
        const chunk = this._file.slice(
          offset,
          offset + process.env.VUE_APP_UPLOAD_CHUNK_SIZE
        );
        offset += process.env.VUE_APP_UPLOAD_CHUNK_SIZE;
        yield chunk.arrayBuffer();
      }
    };
  }

  encryptChunk(g) {
    return async function* () {
      for await (const chunk of g()) {
        yield this._encryptionService.encrypt(chunk);
      }
    };
  }

  uploadChunk(g) {
    const post = this.post.bind(this);
    return async function* () {
      for await (const chunk of g()) {
        yield post(chunk);
      }
    };
  }
}
