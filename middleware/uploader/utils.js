const fs = require('fs')
const { promisify } = require('util')
const { resolve, join } = require('path')

const mkdir = promisify(fs.mkdir)
const rmdir = promisify(fs.rmdir)
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const stat = promisify(fs.stat)
const deleteFile = promisify(fs.unlink)

const checkAvailableSpace = (bytes, user) => {
  const availableSpace = user.availableSpace
  if (bytes > availableSpace){
    return false
  }
  return availableSpace
}

const monitorAvailableSpace = async (file, totalFileSize, user) => {
  const availableSpace = checkAvailableSpace(totalFileSize, user)
  if (!availableSpace) {
    throw new Error('Not enough storage space available')
  }
  const { size } = await stat(file)
  return size
}

const reconstructFile = async (files, tempDir, destDir, filename, user) => {
  let totalFileSize = 0
  const target = join(destDir, filename)
  const worker = new Worker();
  files
    .sort((a,b) => Number(a) - Number(b))
    .forEach(async file => {
      try {
        //  Read file size on write to check for fake reported size on header
        const size = await monitorAvailableSpace(join(tempDir, file), totalFileSize, user)
        totalFileSize += size

        //  Read chunk and append to final location
        const data = fs.readFileSync(join(tempDir, file))
        fs.writeFileSync(target, data, { flag: 'a' })
        //  Using synchronous streams?

        //  Delete each file after writing to final location
        await deleteFile(join(tempDir, file))
      } catch (e) {
        throw new Error(e)
      }
    })

  //  Delete directory created to hold individual chunks
  await rmdir(tempDir, { recursive: true })

  return {
    owner: user._id,
    filename,
    directory: destDir,
    filesize: totalFileSize,
  }
}

module.exports = {
  checkAvailableSpace,
  reconstructFile,
  mkdir,
  readdir
}
