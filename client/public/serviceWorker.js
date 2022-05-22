/* eslint-disable */

let key = null; // CryptoKey
let file = null; // File
let chunkSize = null; // number

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  clients
    .claim()
    .then(() => console.log('Service Worker activated.'))
    .catch(console.error);
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('http://localhost:3000/file/download/')) {
    event.respondWith(downloadStream(event.request.url, event));
  }
});

self.addEventListener('message', (event) => {
  // Keep SW alive to allow large downloads
  if (event.data === 'ping') {
    clients.get(event.clientId).then((client) => {
      console.log(client);
      client.postMessage('pong');
    });
    return null;
  }

  key = event.data.key;
  file = event.data.file;
  chunkSize = event.data.chunkSize;

  console.log(key, file, chunkSize);
});

/**
 * Downloads a given resource performing on-the-fly decryption.
 * @param  {string}    url   The url of the destination resource
 * @param  {object}    event Automatic event parameter coming from the Service Worker
 * @return {Response}        A Response object containing the decryption stream
 */
function downloadStream(url, event) {
  console.log(url, event);
  const headers = {
    'Content-Type': 'application/octet-stream; charset=utf-8',
    'Content-Disposition': `attachment; filename="${file.name}"; filename*="${file.name}"`,
    'Content-Length': file.size,
    'X-Content-Type-Options': 'nosniff',
  };

  return new Promise((resolve, reject) => {
    event.waitUntil(
      (async function () {
        const response = await fetch(url);
        const slicedStream = sliceStream(response.body);
        const decryptedStream = decryptionStream(slicedStream);
        resolve(new Response(decryptedStream, headers));
      })()
    );
  });
}

/**
 * Produces a readable stream of same-sized chunks of data
 * @param  {ReadableStream}  readable  Stream of data e.g., network request
 * @return {ReadableStream}            Another readable stream with chunks of predictable size
 */
function sliceStream(readable) {
  const reader = readable.getReader();
  let chunkSize, offset, buffer;

  return new ReadableStream({
    start(controller) {
      chunkSize = chunkSize + 64; // 32 salt + 16 iv + 16 AEAD
      buffer = new Uint8Array(chunkSize);
      console.log('starting slicing...');
    },

    async pull(controller) {
      while (true) {
        const { value: chunk, done } = await reader.read();
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
    },
  });
}

/**
 * Transforms an input readable stream of data by decrypting it's content
 * @param  {ReadableStream}  readable  Stream of data e.g., network request
 * @param  {object}          event     The fetch event contains the clientId to send postmessages back to the main thread
 * @return {ReadableStream}            Another readable stream of unencrypted data
 */
function decryptionStream(readable) {
  const reader = readable.getReader();

  return new ReadableStream({
    async start(controller) {
      console.log('starting decryption');
    },
    async pull(controller) {
      while (true) {
        const { value: chunk, done } = await reader.read();

        if (done) {
          return controller.close();
        }

        const decryptedChunk = await decryptData(chunk, key);
        controller.enqueue(decryptedChunk);
      }
    },
    cancel(reason) {
      readable.cancel(reason);
    },
  });
}

/**
 * Creates an cryptographic key used for decryption
 * @param  {string}      password  User input used to derive the encryption key
 * @param  {Uint8Array}  salt      Array of random values used to derive the key
 * @return {CryptoKey}             Cryptographic key used for decryption
 */
async function deriveDecryptionKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 250000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['decrypt']
  );
}

/**
 * Decrypt data
 * @param  {buffer}      plaintext Data to be encrypted in ArrayBuffer, TypedArray of ArrayBufferView form
 * @param  {string}      password  User input used to derive the encryption key
 * @return {Uint8Array}            Decrypted data in unsigned 8-bit array form
 */
async function decryptData(ciphertext, key) {
  const salt = ciphertext.slice(0, 32);
  const iv = ciphertext.slice(32, 32 + 16);
  const encryptedBytes = ciphertext.slice(32 + 16);

  // const key = await deriveDecryptionKey(password, salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedBytes
  );

  return new Uint8Array(decryptedBuffer);
}
