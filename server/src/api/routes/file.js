import { Router } from "express";
import { fileController } from "../controllers";

const { createReadStream } = require("fs");
const { pipeline } = require("stream");
const auth = require("../middleware/auth");
const uploader = require("../middleware/uploader");
const File = require("../models/file");

const router = Router();

router.post("/upload/:filename/:currentChunk", fileController.uploadFile);

router.put("/u/meta/:id", fileController.updateFileMetadata);

router.get("/download/:id", async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      expired: false,
    });

    if (!file) {
      throw new Error("Resource does not exist or has expired.");
    }

    // Immediately set expired flag to true to avoid concurrent reads of the file
    // file.expired = true;
    await file.save();

    res.set("Content-Type", "application/octet-stream");
    pipeline(createReadStream(file.filepath), res, (err) => {
      if (err) console.error(err);
      else file.remove();
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get("/d/meta/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      throw new Error("Resource does not exist.");
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
