import { PathLike } from 'fs';
import { Document } from 'mongoose';

export interface FileInterface {
  name?: string;
  encryptedMetadata?: Buffer;
  directory?: PathLike | string;
  size?: number;
  expired?: boolean;
  createdAt?: Date;
}

/**
 * These are virtual properties (getters) on the Mongoose model.
 */

export interface FileBaseDocument extends FileInterface, Document {
  downloadUrl: string;
  filepath: string;
}
