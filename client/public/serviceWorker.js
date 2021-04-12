/*
fetch(e.request.url)
  .then(res => {
    return new Response(decryptionStream, {
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Disposition': 'attachment; filename="filename.mp3"; filename*="filename.mp3"',
        'Content-Type': 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  })
  .catch(console.error)
)
*/

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  clients.claim()
  .then(() => console.log('All pages now using this Service Worker'))
  .catch();
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('http://localhost:3000/download/')) {
    event.respondWith(downloadStream(event.request.url));
  }
});

async function downloadStream(url) {
  
  const response = await fetch(url);
  const slicedStream = sliceStream(response.body);
  const decryptedStream = decryptionStream(slicedStream);
  
  const headers = {
    'Accept-Ranges': 'bytes',
    'Content-Disposition': 'attachment; filename*=filename.mp3',
    'Content-Type': 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff'
  };

  return new Response(decryptedStream, headers);
}

function sliceStream(readable) {
  const reader = readable.getReader();
  let chunkSize, offset, buffer;

  return new ReadableStream({
    start(controller) {
      chunkSize = (1024 ** 2) + 64;
      buffer = new Uint8Array(chunkSize);
      console.log('starting slicing...');
    },

    async pull(controller) {
      // for await (const chunk of reader.read()) {
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
    }
  });
};

function decryptionStream(readable) {
  const reader = readable.getReader();
  return new ReadableStream({
    async start(controller) {
      console.log('starting decryption');
    },
    async pull(controller){
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

  return new Uint8Array(decrypted);
};
