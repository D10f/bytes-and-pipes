import mongoose from 'mongoose';
import fs from 'fs';
import config from '../config';
import { FileBaseDocument } from '../interfaces';

const fileSchema = new mongoose.Schema<FileBaseDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    encryptedMetadata: {
      type: Buffer,
    },
    directory: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '24h',
    },
  },
  { timestamps: true },
);

fileSchema.virtual('downloadUrl').get(function (this: FileBaseDocument) {
  const domain = process.env.development
    ? `${config.DOMAIN}:${config.PORT}`
    : config.DOMAIN;

  return `http://${domain}/d/${this._id}`;
});

fileSchema.virtual('filepath').get(function (this: FileBaseDocument) {
  return `${this.directory}/${this.name}`;
});

fileSchema.pre<FileBaseDocument>('remove', function (next) {
  fs.unlink(`${this.directory}/${this.name}`, (err) => {
    if (err) {
      next(err);
    }
  });
  next();
});

const File = mongoose.model<FileBaseDocument>('Files', fileSchema);

export default File;
