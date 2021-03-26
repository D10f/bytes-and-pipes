import { useState } from 'react';
import { useSelector } from 'react-redux';
import { generateCryptoKey, encryptData, sha1sum } from '../scripts/crypto';

const useEncryptionStream = async (file, password) => {

  const [currentChunk, setCurrentChunk] = useState(1);
  const [progress, setProgress] = useState(0);

  // Upload in chunks of 1MB, and total chunks to upload
  const chunkSize = 1024 * 1024 * 1;
  const totalChunks = Math.ceil(file.size / chunkSize);

  // Generate random salt, and encryption key
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await generateCryptoKey(password, salt);

  const authToken = useSelector(state => state.user.jwt);

  const requestOptions = {
    method: 'POST',
    headers: {
      "Content-type": "application/octet-stream",
      "Content-parts": totalChunks,
      "Content-filesize": file.size,
      "Authorization": `Bearer ${authToken}`
    }
  };

  const filenameHash = await sha1sum(file.name);

  const pipe = (...fns) => data => fns.reduce((val, fn) => fn(val), data);

  // Run the following generator functions
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
    async function* _uploader() {
      for await (const chunk of stream()) {

        requestOptions['body'] = chunk;
        const endpoint = `http://localhost:8080/upload/${filenameHash}/${currentChunk}`;

        try {
          const res = await fetch(endpoint, requestOptions);
          const url = await res.json();

          setCurrentChunk(currentChunk + 1);

          yield;

        } catch (e) {
          console.error(e);
        }
      }
    }
    return _uploader;
  }
};

export default useEncryptionStream;
