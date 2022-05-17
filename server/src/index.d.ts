interface FileInterface {
  name?: string;
  encryptedMetadata?: Buffer;
  directory?: fs.PathLike | string;
  size?: number;
  expired?: boolean;
  createdAt?: Date;
}

/**
 * These are virtual properties (getters) on the Mongoose model.
 */
interface FileBaseDocument extends FileInterface, Document {
  downloadUrl: string;
  filepath: string;
}
