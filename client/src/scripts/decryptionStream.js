/**
* Produces a readable stream of same-sized chunks of data
* @param  {ReadableStream}  readable  Stream of data e.g., network request
* @return {ReadableStream}            Another readable stream with chunks of predictable size
*/
export const sliceStream = readable => {
  const reader = readable.getReader();
  let chunkSize, offset, buffer;

  return new ReadableStream({
    start(controller) {
      chunkSize = (1024 ** 2) * 1 + 64;
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
    }
  });
};

/**
* Transforms an input readable stream of data by decrypting it's content
* @param  {ReadableStream}  readable  Stream of data e.g., network request
* @param  {object}          event     The fetch event contains the clientId to send postmessages back to the main thread
* @return {ReadableStream}            Another readable stream of unencrypted data
*/
const decryptionStream = (readable, client) => {
  const reader = readable.getReader();
  let bytes = 0;

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

        const decryptedChunk = await decryptData(chunk, key);
        controller.enqueue(decryptedChunk);

        bytes += chunk.length;
        // client.postMessage(bytes * 100 / file.size);
      }
    },
    cancel(reason) {
      readable.cancel(reason);
    }
  });
};
