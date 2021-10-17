import { Response, RequestHandler } from "express";
import { pipeline } from 'stream';
import config from "../../config";
import FileService from "../../services/FileService";
import { BadRequestError } from '../../services/ErrorService';

export const uploadFile: RequestHandler = async (req, res, next) => {
  const contentParts: string | undefined = req.header("Content-parts");
  const contentFilesize: string | undefined = req.header("Content-filesize");

  if (!contentParts || !contentFilesize) {
    next(new BadRequestError("Missing required headers."));
  }

  if (Number(contentFilesize) > config.MAX_FILE_SIZE) {
    next(new BadRequestError("Files larger than 1GB are not allowed."));
  }

  // Each chunk contains additional 64 bytes: 32 salt, 16 IV and 16 AEAD
  if (req.body.length > Number(contentFilesize) + Number(contentParts) * 64) {
    next(new BadRequestError("File is larger than reported size."));
  }

  const { filename, currentChunk } = req.params;

  const tempDir = await FileService.createTempDirectory(filename);

  FileService.writeFile(tempDir, async () => {
    try {
      const files = await FileService.readDirectory(tempDir);

      if (files.length !== Number(contentParts)) {
        return res.send({ uploaded: currentChunk });
      }

      const newFile = await FileService.createRecord({
        name: filename,
        directory: tempDir,
        size: Number(contentFilesize),
      });

      res.status(201).json({ url: newFile.downloadUrl, id: newFile._id });
    } catch (err) {
      next(err);
    }
  });
};

export const updateFileMetadata: RequestHandler = async (req, res, next) => {

  const updates = {
    encryptedMetadata: req.body as Buffer
  };

  try {
    await FileService.updateFileMetadata(req.params.id, updates);
    res.status(202).send("");
  } catch (err) {
    next(err);
  }
};

export const downloadFile: RequestHandler = async (req, res, next) => {
  try {
    const file = await FileService.findFileById(req.params.id);

    if (!file) {
      throw new BadRequestError('No file found with that id.');
    }

    // const fileStream = FileService.readAsStream(file.filepath);

    res.set("Content-Type", "application/octet-stream");

    pipeline(
      await FileService.reconstructRecord(file),
      res,
      async (err) => {
        if (err) {
          next(err);
        }
      await FileService.deleteRecord(file._id);
    });

  } catch (err) {
    next(err);
  }
};

export const readFileMetadata: RequestHandler = async (req, res, next) => {
  try {
    const file = await FileService.findFileById(req.params.id);

    if (!file) {
      throw new BadRequestError('No file found with that id.');
    }

    res.send(file.encryptedMetadata);
  } catch (err) {
    next(err);
  }
};
