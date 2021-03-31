const express = require('express');
const fs = require('fs');

const auth = require('../middleware/auth');
const uploader = require('../middleware/uploader/uploader');
const File = require('../models/file');
const convertBytes = require('../utils/convertbytes');

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

    res.status(201).send(file.downloadUrl);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
})

router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      throw new Error('Resource does not exist.')
    }

    const path = file.filepath;

    // const path = '/home/wallabye/Projects/bytes-and-pipes/uploads/52470318d4bf87e70d859fcea434c025019f70ca';
    const reader = fs.createReadStream(path);
    reader.pipe(res);

  } catch (err) {
    res.status(400).send(err.message);
  }
  // const reader = fs.createReadStream('/home/zenzen/Desktop/rsync')
  // reader.pipe(res)
  // res.send()
});

router.delete('/files/delete/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
    req.user.updateUsedStorage(-file.filesize)
    await req.user.save()
    await file.remove()
    res.status(201).send()
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

module.exports = router
