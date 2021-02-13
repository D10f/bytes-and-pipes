const express = require('express')
const fs = require('fs')
const auth = require('../../middleware/auth')
const uploader = require('../../middleware/uploader/uploader')
const File = require('../models/file')

const convertBytes = require('../utils/convertbytes')

const router = express.Router()

router.post('/upload/:filename/:seq', auth, uploader, async (req, res) => {
  const file = new File(req.file)
  try {
    await file.save()
    req.user.updateUsedStorage(file.filesize)
    await req.user.save()

    res.status(201).send({
      usedStorage: req.user.usedStorage,
      downloadUrl: file.downloadUrl
    })
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/download/:id', async (req, res) => {
  // const file = await File.findById(req.params.id)
  const reader = fs.createReadStream('/home/zenzen/Desktop/rsync')
  reader.pipe(res)
  res.send()
})

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
