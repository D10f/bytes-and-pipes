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
    },

    async pull(controller) {
      for await (const chunk of reader.read()) {

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

      // Any remaining bytes can be enqueued to the stream
      if (offset > 0) {
        controller.enqueue(buffer.slice(0, offset));
      }

      // Close the stream when no more chunks are available
      return controller.close();
    },

    cancel(reason) {
      readable.cancel(reason);
    }
  });
};

/**
* Decrypts a readable stream of data
* @param  {object} stream A ReadableStream, expects chunks of size 1MB + 64bytes
* @return {object} A ReadableStream of data
*/
function decryptionStream(stream, mode = 'decrypt') {
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
      for await (const chunk of reader.read()) {

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

      // Any remaining bytes can be enqueued to the stream
      if (offset > 0) {
        controller.enqueue(buffer.slice(0, offset));
      }

      // Close the stream when no more chunks are available
      return controller.close();
    },

    cancel(reason) {
      readable.cancel(reason);
    }
  });
};
