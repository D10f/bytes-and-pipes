const pipe = (...fns) => data => fns.reduce((val, fn) => fn(val), data)

const encryptionStream = (file) => {
  const chunkSize = 1024 * 1024 * 10
  const contentParts = Math.ceil(file.size / chunkSize)

  // pipe(reader, encrypter, uploader)(file)

  function reader(file) {
    let offset = 0
    async function* _reader() {
      while (offset <= file.size) {
        const chunk = file.slice(offset, offset + chunkSize)
        offset += chunkSize
        yield chunk.arrayBuffer()
      }
    }

    return _reader
  }

  function encrypter(stream) {
    async function* _encrypter() {
      for await (const chunk of stream()) {
        yield encryptData(chunk)
      }
    }
    return _encrypter
  }

  async function uploader(stream) {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjZjZDAxMDJjNjEyOTJmNDQ2NmMzMGMiLCJpYXQiOjE2MDA5NjY2NzJ9.d9kELDx_H_G4tZ7iKNTLfq9pVQlh0tLx8sr8NLVKrgE'
    let seq = 0
    const options = {
      method: 'POST',
      headers: {
        "Content-type": "application/octet-stream",
        "Content-parts": contentParts,
        "Content-filesize": file.size,
        "Authorization": `Bearer ${token}`
      }
    }

    async function _uploader() {
      for await (const chunk of stream()) {
        options['body'] = chunk
        let url = `http://localhost:3000/upload/${file.name}/${seq++}`
        fetch(url, options)
          .then(res => res.json())
          .then(console.log)
          .catch(console.error)
      }
    }

    _uploader()
  }
}
