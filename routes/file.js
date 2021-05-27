const express = require('express');
const { createReadStream } = require('fs');
const { pipeline } = require('stream');
const auth = require('../middleware/auth');
const uploader = require('../middleware/uploader');
const File = require('../models/file');

const router = express.Router();

// router.post('/upload/:filename/:seq', auth, uploader, async (req, res) => {
router.post('/upload/:filename/:currentChunk', uploader, async (req, res) => {

  const file = new File(req.file);

  try {
    await file.save()
    // req.user.updateUsedStorage(file.filesize)
    // await req.user.save()

    // res.status(201).send({
    //   usedStorage: req.user.usedStorage,
    //   downloadUrl: file.downloadUrl
    // });

    res.status(201).send({ url: file.downloadUrl, id: file._id });
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});

router.put('/u/meta/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      throw new Error('Resource does not exist.')
    }

    file.encryptedMetadata = req.body;
    await file.save();

    res.status(202).send('');
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});

router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      expired: false
    });

    if (!file) {
      throw new Error('Resource does not exist or has expired.');
    }

    // Immediately set expired flag to true to avoid concurrent reads of the file
    file.expired = true;
    await file.save();

    pipeline(
      createReadStream(file.filepath),
      res,
      (err) => {
        if (err) console.error(err);
        else file.remove();
      }
    );

  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/d/meta/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      throw new Error('Resource does not exist.')
    }

    res.send(file.encryptedMetadata);

  } catch (err) {
    res.status(400).send(err.message);
  }
});

// router.delete('/files/delete/:id', auth, async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id)
//     req.user.updateUsedStorage(-file.filesize)
//     await req.user.save()
//     await file.remove()
//     res.status(201).send()
//   } catch (e) {
//     console.log(e)
//     res.status(500).send(e)
//   }
// })

module.exports = router;
