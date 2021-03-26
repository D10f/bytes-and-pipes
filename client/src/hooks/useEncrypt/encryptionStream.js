import encryptData from './crypto';

const pipe = (...fns) => data => fns.reduce((val, fn) => fn(val), data);

export default (file, password, setProgress, setUrl) => {
  const chunkSize = 1024 * 1024 * 10;
  const contentParts = Math.ceil(file.size / chunkSize);

  const requestOptions = {
    method: 'POST',
    headers: {
      "Content-type": "application/octet-stream",
      "Content-parts": contentParts,
      "Content-filesize": file.size
    }
  };

  let sequence = 0;

  // Return the "transformer stream"
  return pipe(reader, encrypter, uploader)(file);

  // Functions are hoisted
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
        yield encryptData(chunk, password);
      }
    }
    return _encrypter;
  }

  async function uploader(stream) {

    async function* _uploader() {
      for await (const chunk of stream()) {

        requestOptions['body'] = chunk;
        const endpoint = `http://localhost:3000/upload/${file.name}/${sequence++}`;

        try {
          const res = await fetch(endpoint, requestOptions);
          const url = await res.json();

          const progress = Math.round((sequence * 100) / contentParts);

          if (progress === 100) {
            setUrl(url);
            return;
          }

          setProgress(progress);

          yield;

        } catch (e) {
          console.error(e);
        }
      }
    }

    return _uploader;
  }
};
