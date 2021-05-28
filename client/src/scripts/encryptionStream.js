import {
  generateShareableUrl,
  generateEncryptionKey,
  deriveEncryptionKey,
  encryptData,
  sha256sum
} from './crypto';

const encryptionStream = async (file, password, authToken, setError, setProgress, setUrl) => {

  // Upload in chunks of 1MB, and total chunks to upload
  const chunkSize = 1024 * 1024 * 1;
  const totalChunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 1;

  // Generate random salt and obtain encryption key from password, or randomly generated
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = password
    ? await deriveEncryptionKey(password, salt)
    : await generateEncryptionKey();

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

        // Update progress status
        setProgress((currentChunk * 100) / totalChunks);
        currentChunk++;

        // All chunks have been uploaded
        if (res.status === 201) {
          const { url, id } = await res.json();

          // Encrypt metadata: name, size and type as JSON string.
          const fileMetadata = JSON.stringify({
            name: file.name,
            size: file.size,
            type: file.type,
            chunkSize
          });

          const encoded = new TextEncoder().encode(fileMetadata);
          const encryptedMetadata = await encryptData(encoded, key, salt);

          requestOptions['method'] = 'PUT';
          requestOptions['body'] = encryptedMetadata;
          await fetch(`http://localhost:3000/u/meta/${id}`, requestOptions);

          // If password was not provided, extract key in JWT Web format and append to URL
          if (!password) {
            const finalUrl = await generateShareableUrl(url, key);
            setUrl(finalUrl);
          } else {
            setUrl(url);
          }

          setProgress(100);
        }
      }
    }
    _uploader();
  }
};

export default encryptionStream;
