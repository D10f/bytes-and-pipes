const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

// const convertBytes = require('../../server/utils/convertbytes');

const uploader = async (req, res, next) => {
  try {
    if (!req.headers('Content-parts') || !req.headers('Content-filesize')){
      throw new Error('Missing required headers.');
    }

    if (req.headers('Content-filesize') > 1024 * 1024 * 1024) {
      throw new Error('Files larger than 1GB are not allowed.')
    }

    if (req.headers('Content-filesize') > req.user.availableSpace){
      throw new Error('Not enough storage space available');
    }

    const { filename, currentChunk } = req.params;

    // Define temporary and destination directories
    const tempDir = path.resolve(os.tmpdir(), filename);
    const destDir = path.resolve(__dirname, '../../../uploads', req.user._id.toString());

    // Create directories if they do not exist
    await mkdir(tempDir, { recursive: true });
    await mkdir(destDir, { recursive: true });

    // Write a separate file per uploaded chunk to temporary directory
    const writer = fs.createWriteStream(path.resolve(tempDir, currentChunk));
    writer.write(req.body);

    writer.close(async () => {
      const files = await readdir(tempDir);

      // If not all chunks have uploaded, return
      if (files.length !== Number(req.headers('Content-parts'))) {
        return res.send({ uploaded: currentChunk });
      }

      // All chunks uploaded, reconstruct chunks into single file
      const path = path.join(destDir, filename);
      files
        .sort((a,b) => Number(a) - Number(b))
        .forEach(file => {
          const data = fs.readFileSync(path.join(tempDir, file));
          fs.writeFileSync(path, data, { flag: 'a' });
          fs.unlink(path.join(tempDir, file));
        });

      const { size } = await stat(path);

      req.file = {
        owner: user._id,
        name: filename,
        directory: destDir,
        size: size
      };

      next()
    })

  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }
}

module.exports = uploader
