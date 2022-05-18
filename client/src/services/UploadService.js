const UPLOAD_CHUNK_SIZE = Number(process.env.VUE_APP_UPLOAD_CHUNK_SIZE);

export class UploadService {
  constructor(file, encryptionService) {
    this._file = file;
    this._encryptionService = encryptionService;

    this._currentChunk = 1;
    this._totalChunks = Math.ceil(file.size / UPLOAD_CHUNK_SIZE);

    this._headers = new Headers({
      'Access-Control-Request-Headers':
        'Content-type,Content-parts,Content-filesize',
      'Content-Type': 'application/octet-stream',
      'Content-parts': `${this._totalChunks}`,
      'Content-filesize': `${this._file.size}`,
    });

    this._uploadId = crypto.randomUUID();
  }

  start() {
    const readStream = this._readChunk().bind(this);
    const encryptStream = this._encryptChunk(readStream).bind(this);
    const uploadStream = this._uploadChunk(encryptStream).bind(this);
    return uploadStream();
  }

  async _post(payload) {
    const endpoint =
      process.env.VUE_APP_BASE_URL +
      `/file/upload/${this._uploadId}/${this._currentChunk}`;

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
      this._responseObj = await response.json();

      return {
        progress: 100,
        url: await this._encryptionService.generateUrl(this._responseObj.url),
      };
    }

    return {
      progress: (this._currentChunk++ * 100) / this._totalChunks,
      url: undefined,
    };
  }

  async _put(payload) {
    let { url, id } = this._responseObj;

    const endpoint = process.env.VUE_APP_BASE_URL + `/file/u/meta/${id}`;

    await fetch(endpoint, {
      method: 'PUT',
      body: payload,
      headers: this._headers,
    });

    return this._encryptionService.strategy === 'RANDOMLY_GENERATED'
      ? await this._encryptionService.generateShareableUrl(url)
      : url;
  }

  _readChunk() {
    let offset = 0;
    return async function* () {
      while (offset <= this._file.size) {
        const chunk = this._file.slice(offset, offset + UPLOAD_CHUNK_SIZE);
        offset += UPLOAD_CHUNK_SIZE;
        yield chunk.arrayBuffer();
      }
    };
  }

  _encryptChunk(g) {
    return async function* () {
      for await (const chunk of g()) {
        yield this._encryptionService.encrypt(chunk);
      }
    };
  }

  _uploadChunk(g) {
    return async function* () {
      for await (const chunk of g()) {
        yield this._post(chunk);
      }
    };
  }
}
