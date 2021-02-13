const { createWriteStream } = require('fs')
const { resolve, join } = require('path')
const { tmpdir } = require('os')
const { checkRequestHeaders, checkAvailableSpace, reconstructFile, deleteFile, mkdir, readdir } = require('./utils')
const convertBytes = require('../../server/utils/convertbytes')

function checkHeaders() {
  if (!req.headers('content-parts') || !req.headers('content-filesize')){
    throw new Error('Missing required headers.');
  }
}

function checkAvailableSpace(){
  if (req.headers['content-filesize'] > req.user.availableSpace){
    throw new Error('Not enough storage space available').
  }
}

const uploader = async (req, res, next) => {
  try {
//     const { contentParts, expectedFileSize } = await checkRequestHeaders(req.headers)
//     const availableSpace = checkAvailableSpace(expectedFileSize, req.user)
//     if (!availableSpace) {
//       throw new Error('Not enough storage space available')
//     }

    checkHeaders();
    checkAvailableSpace();


    const { filename, seq } = req.params
    //  Define temporary and destination directories
    const tempDir = resolve(tmpdir(), filename)
    const destDir = resolve(__dirname, '../../../uploads', req.user._id.toString())
    //  Create directories if they do not exist
    await mkdir(tempDir, { recursive: true })
    await mkdir(destDir, { recursive: true })

    //  Write a separate file per uploaded chunk to temporary directory
    const writer = createWriteStream(resolve(tempDir, seq))
    writer.write(req.body)

    writer.close(async () => {
      const files = await readdir(tempDir)

      //  Check if the number of chunks uploaded matches the number of chunks expected
      if (files.length !== Number(contentParts)) {
        return res.send({ uploaded: seq })
      }

      //  Creates a new file at destination directory from all the chunks uploaded
      const file = await reconstructFile(files, tempDir, destDir, filename, req.user)

      req.file = file

      next()
    })

  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }
}

module.exports = uploader
