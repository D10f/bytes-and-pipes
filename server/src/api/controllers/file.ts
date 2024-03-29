import { createReadStream } from 'fs';
import { resolve } from 'path';
import { pipeline, Readable } from 'stream';
import { RequestHandler } from 'express';
import config from '../../config';
import FileService from '../../services/FileService';
import {
  BadRequestError,
  RequestEntityTooLarge,
} from '../../services/ErrorService';

/**
 * Receives a chunk of a file and saves it to the file system.
 * Checks the headers for metadata about the file e.g., size, number of chunks uploaded, etc.
 */
export const uploadFile: RequestHandler = async (req, res, next) => {
  const contentParts: string | undefined = req.header('Content-parts');
  const contentFilesize: string | undefined = req.header('Content-filesize');

  if (!contentParts || !contentFilesize) {
    next(new BadRequestError('Missing required headers.'));
    return;
  }

  if (Number(contentFilesize) > config.MAX_FILE_SIZE) {
    next(new RequestEntityTooLarge('Files larger than 1GB are not allowed.'));
    return;
  }

  // Each chunk contains additional 64 bytes: 32 salt, 16 IV and 16 AEAD
  if (req.body.length > Number(contentFilesize) + Number(contentParts) * 64) {
    next(new BadRequestError('File is larger than reported size.'));
    return;
  }

  const { filename, currentChunk } = req.params;

  try {
    const tempDir = await FileService.createTempDirectory(filename);

    const done = await FileService.writeFile({
      location: tempDir,
      data: req.body,
      contentParts: Number(contentParts),
      currentChunk: currentChunk,
    });

    if (done) {
      const newFile = await FileService.createRecord({
        name: filename,
        directory: tempDir,
        size: Number(contentFilesize),
      });

      return res.status(201).json({
        url: newFile.downloadUrl,
        id: newFile._id,
      });
    }

    res.send({ uploaded: currentChunk });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates a file record with encrypted metadata buffer
 */
export const updateFileMetadata: RequestHandler = async (req, res, next) => {
  if (!req.body) {
    next(new BadRequestError('Missing required body content.'));
    return;
  }

  const updates = {
    encryptedMetadata: req.body as Buffer,
  };

  try {
    await FileService.updateFileMetadata(req.params.id, updates);
    res.status(202).send('');
  } catch (err) {
    next(err);
  }
};

// TODO: Proper typings
export const downloadFile: RequestHandler = async (req, res, next) => {
  try {
    console.log('file.ts line 91:', req.params.id);
    const file = await FileService.findFileById(req.params.id);

    if (!file) {
      next(new BadRequestError('No file found with that id.'));
      return;
    }

    // await FileService.reconstructRecord(file!);

    res.set('Content-Type', 'application/octet-stream');

    /* eslint-disable-next-line */
    pipeline(
      Readable.from(FileService.reconstructRecord(file!)),
      res,
      async (err) => {
        if (err) {
          return next(err);
        }
        /* eslint-disable-next-line */
        await FileService.deleteRecord(file!._id);
      },
    );
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
