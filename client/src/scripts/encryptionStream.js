import { deriveEncryptionKey, encryptData, sha256sum } from './crypto';
// import { setError } from '../redux/actions/error';

const encryptionStream = async (file, password, authToken, setError, setUrl) => {
  // Upload in chunks of 10MB, and total chunks to upload
  const chunkSize = 1024 * 1024 * 10;
  const totalChunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 1;

  // Generate random salt and encryption key
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await deriveEncryptionKey(password, salt);

  // Also random filename to avoid overwrites in the server
  const filename = await sha256sum(`${file.name + Date.now()}`);

  const requestOptions = {
    method: 'POST',
    headers: {
      "Access-Control-Request-Headers": "Content-type,Content-parts,Content-filesize",
      "Content-type": "application/octet-stream",
      "Content-parts": totalChunks,
      "Content-filesize": file.size,
      // "Authorization": `Bearer ${authToken}`
    }
  };

  const pipe = (...fns) => data => fns.reduce((val, fn) => fn(val), data);
  pipe(reader, encrypter, uploader)(file);

  function reader(file) {
    let offset = 0;
    async function* _reader() {
      while (offset <= file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        offset += chunkSize;
        yield chunk.arrayBuffer();
      }
    }
    return _reader;
  }

  function encrypter(stream) {
    async function* _encrypter() {
      for await (const chunk of stream()) {
        yield encryptData(chunk, key, salt);
      }
    }
    return _encrypter;
  }

  function uploader(stream) {
    async function _uploader() {
      for await (const chunk of stream()) {

        requestOptions['body'] = chunk;
        const endpoint = `http://localhost:3000/upload/${filename}/${currentChunk}`;

        const res = await fetch(endpoint, requestOptions);

        // If server returns an error, stop streaming
        if (!res.ok) {
          const error = await res.text();
          setError(error);
          return;
        }

        if (res.status === 201) {
          const { url, id } = await res.json();

          // Encrypt metadata: name, size and type as JSON string.
          const fileMetadata = JSON.stringify({ name: file.name, size: file.size, type: file.type });
          const encoded = new TextEncoder().encode(fileMetadata);
          const encryptedMetadata = await encryptData(encoded, key, salt);

          requestOptions['method'] = 'PUT';
          requestOptions['body'] = encryptedMetadata;
          await fetch(`http://localhost:3000/u/meta/${id}`, requestOptions);

          setUrl(url);
        }

        currentChunk++;
      }
    }
    _uploader();
  }
};

export default encryptionStream;
