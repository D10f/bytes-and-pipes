import config from "../../../config";
import FileService from "../../services/FileService";
import { BadRequestError } from '../../services/ErrorService';

export const uploadFile = async (req, res, next) => {
  const contentParts = req.header("Content-parts");
  const contentFilesize = req.header("Content-filesize");

  if (!contentParts || !contentFilesize) {
    next(BadRequestError("Missing required headers."));
  }

  if (contentFilesize > config.MAX_FILE_SIZE) {
    next(BadRequestError("Files larger than 1GB are not allowed."));
  }

  // Each chunk contains additional 64 bytes: 32 salt, 16 IV and 16 AEAD
  if (req.body.length > contentFilesize + contentParts * 64) {
    next(BadRequestError("File is larger than reported size."));
  }

  const { filename, currentChunk } = req.params;

  const tempDir = await FileService.createTempDirectory(filename);

  FileService.writeFile(tempDir, async () => {
    const files = await FileService.readDirectory(tempDir);

    if (files.length !== Number(contentParts)) {
      return res.send({ uploaded: currentChunk });
    }

    try {
      const newFile = await FileService.saveNewFile({
        name: filename,
        directory: tempDir,
        size: contentFilesize,
      });

      res.status(201).json({ url: newFile.downloadUrl, id: newFile._id });
    } catch (err) {
      next(err);
    }
  });
};

export const updateFileMetadata = async (req, res, next) => {

  const updates = {
    encryptedMetadata: req.body
  };

  try {
    await FileService.updateFile(req.params.id, updates);
    res.status(202).send("");
  } catch (e) {
    next(err);
  }
};