self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  clients.claim()
  .then(() => console.log('All pages now using this Service Worker'))
  .catch();
});

self.addEventListener('fetch', e => {
  if (e.request.url.startsWith('http://localhost:3000/download/')) {
    e.respondWith(
      // fetch(e.request.url)
      fetch('http://localhost:3000/testfile.zip')
        .then(res => {
          return new Response(sliceStream(res.body), {
            headers: {
              'Accept-Ranges': 'bytes',
              'Content-Disposition': 'attachment; filename="filename.mp3"; filename*="filename.mp3"',
              'Content-Type': 'application/octet-stream; charset=utf-8',
              'X-Content-Type-Options': 'nosniff'
            }
          })
        })
        .catch(console.error)
    );
  }
});

/**
* Ensures chunks received from a readable stream are of a fixed size
* @param  {object} stream A ReadableStream such as from a Response object
* @param  {string} mode Mode of operation, one of "encrypt" or "decrypt"
* @return {object} A ReadableStream with chunks of fixed byteLength
*/
function sliceStream(stream, mode = 'decrypt') {
  const reader = stream.getReader();
  let chunkSize, offset, buffer;

  return new ReadableStream({
    start(controller) {
      chunkSize = mode === 'decrypt'
      ? (1024 ** 2) + 16 + 16 + 32
      : 1024 ** 2;
      buffer = new Uint8Array(chunkSize);
      console.log('start sliceStream');
    },

    async pull(controller) {
      // for await (const chunk of reader.read()) {
      while (true) {

        const { value: chunk, done } = await reader.read();
        console.log(chunk.byteLength);
        if (done) {
          if (offset > 0) {
            controller.enqueue(buffer.slice(0, offset));
          }
          return controller.close();
        }

        let i = 0;

        if (offset > 0) {
          const len = Math.min(chunk.byteLength, chunkSize - offset);
          buffer.set(chunk.slice(0, len), offset);
          offset += len;
          i += len;

          if (offset === chunkSize) {
            controller.enqueue(buffer);
            offset = 0;
            buffer = new Uint8Array(chunkSize);
          }
        }

        while (i < chunk.byteLength) {
          const remainingBytes = chunk.byteLength - i;
          if (remainingBytes >= chunkSize) {
            const record = chunk.slice(i, i + chunkSize);
            i += chunkSize;
            controller.enqueue(buffer);
            offset = 0;
            buffer = new Uint8Array(chunkSize);
          } else {
            const end = chunk.slice(i, i + remainingBytes);
            i += end.byteLength;
            buffer.set(end);
            offset = end.byteLength;
          }
        }
      }
    },

    cancel(reason) {
      readable.cancel(reason);
    }
  });
};

/* ORIGINAL */
/* function sliceStream(stream, mode = 'decrypt') {
  const reader = stream.getReader();
  let chunkSize, offset, buffer;

  return new ReadableStream({
    start(controller) {
      chunkSize = mode === 'decrypt'
      ? (1024 ** 2) + 16 + 16 + 32
      : 1024 ** 2;
      buffer = new Uint8Array(chunkSize);
    },

    async pull(controller) {
      // for await (const chunk of reader.read()) {
      while (true) {

        const { value: chunk, done } = await reader.read();

        if (done) {
          // Any remaining bytes can be enqueued to the stream
          if (offset > 0) {
            const decryptedChunk = await decryptData(buffer.slice(0, offset));
            controller.enqueue(decryptedChunk);
            return controller.close();
          } else {
            // Close the stream when no more chunks are available
            return controller.close();
          }
        }

        let i = 0;

        if (offset > 0) {
          const len = Math.min(chunk.byteLength, chunkSize - offset);
          buffer.set(chunk.slice(0, len), offset);
          offset += len;
          i += len;

          if (offset === chunkSize) {
            const decryptedChunk = await decryptData(buffer);
            controller.enqueue(decryptedChunk);
            offset = 0;
            buffer = new Uint8Array(chunkSize);
          }
        }

        while (i < chunk.byteLength) {
          const remainingBytes = chunk.byteLength - i;
          if (remainingBytes >= chunkSize) {
            const record = chunk.slice(i, i + chunkSize);
            i += chunkSize;
            const decryptedChunk = await decryptData(buffer);
            controller.enqueue(decryptedChunk);
            offset = 0;
            buffer = new Uint8Array(chunkSize);
          } else {
            const end = chunk.slice(i, i + remainingBytes);
            i += end.byteLength;
            buffer.set(end);
            offset = end.byteLength;
          }
        }
      }
    },

    cancel(reason) {
      readable.cancel(reason);
    }
  });
};*/

/**
* Encrypts stream of data one chunk at a time
* @param  {object} stream A ReadableStream such as from a Response object
* @return {object} A ReadableStream
*/
function decryptStream(stream) {
  const reader = stream.getReader();
  let chunkSize;

  return new ReadableStream({
    start(controller) {
      chunkSize = (1024 ** 2) + 16 + 16 + 32;
      console.log('start decryptStream');
    },

    async pull(controller) {
      while (true) {
        const { value: chunk, done } = await reader.read();

        if (done) {
          return controller.close();
        }

        const decryptedChunk = await decryptData(chunk);
        controller.enqueue(decryptedChunk);
      }
    },

    cancel(reason) {
      readable.cancel(reason);
    }
  });
};

async function deriveKey(salt = crypto.getRandomValues(new Uint8Array(32))) {

  const encodedPassword = new TextEncoder().encode('watermelon');

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encodedPassword,
    "PBKDF2",
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [ "encrypt", "decrypt" ]
  );


  return key;
};

async function decryptData(encryptedBuffer) {
  const encryptedBytes = new Uint8Array(encryptedBuffer);

  const salt = encryptedBytes.slice(0, 32);
  const iv = encryptedBytes.slice(32, 32 + 16);
  const data = encryptedBytes.slice(32 + 16);

  const key = await deriveKey(salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return decrypted;
};
