import fs from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';
import File from '../models/file';
import { FileBaseDocument, FileInterface } from '../interfaces';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

interface writeFileInterface {
  location: string;
  data: Buffer;
  contentParts: number;
  currentChunk: string;
}

export default {
  async createTempDirectory(
    filename: string,
    recursive = true,
  ): Promise<string> {
    // const location = path.resolve(os.tmpdir(), 'uploads', filename as string);
    const location = path.resolve('/app', 'uploads', filename as string);
    await mkdir(location, { recursive });
    return location;
  },

  async removeDirectory(filepath: fs.PathLike) {
    await rmdir(filepath);
  },

  async readDirectory(filepath: fs.PathLike) {
    return await readdir(filepath);
  },

  readAsStream(filepath: fs.PathLike): fs.ReadStream {
    return fs.createReadStream(filepath);
  },

  writeFile(file: writeFileInterface): Promise<boolean> {
    const { location, data, contentParts, currentChunk } = file;

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(path.join(location, currentChunk));
      writer.write(data, async (err) => {
        if (err) {
          reject(err.message);
        }

        const files = await this.readDirectory(location);

        if (files.length !== contentParts) {
          resolve(false);
        } else {
          resolve(true); // entire file has been uploaded
        }
      });
    });
  },

  async deleteFile(filepath: fs.PathLike) {
    await unlink(filepath);
  },

  // TODO: Proper typings
  // async reconstructRecord(
  //   record: FileInterface | FileBaseDocument,
  // ): Promise<fs.ReadStream[]> {
  //   const targetDir = record.directory as string;

  //   const fileFragments = await this.readDirectory(targetDir);

  //   return fileFragments
  //     .sort((a, b) => Number(a) - Number(b)) // read from last to first
  //     .map((fragment) =>
  //       fs.createReadStream(path.resolve(targetDir, fragment)),
  //     );
  // },
  async *reconstructRecord(
    record: FileInterface | FileBaseDocument,
  ): AsyncGenerator<Buffer, void, unknown> {
    const targetDir = record.directory as string;

    const fragments = (await this.readDirectory(targetDir)).sort(
      (a, b) => Number(a) - Number(b),
    );

    for (const f of fragments) {
      yield readfile(path.resolve(targetDir, f));
    }
  },

  // async reconstructRecord(record: FileInterface | FileBaseDocument) {
  //   const targetDir = record.directory as string;

  //   const fragments = await this.readDirectory(targetDir);
  //   const targetFile = path.resolve(targetDir, 'file');

  //   fragments
  //     .sort((a, b) => Number(a) - Number(b))
  //     .forEach((fragment) => {
  //       const fragmentPath = path.resolve(targetDir, fragment);
  //       const data = fs.readFileSync(fragmentPath);
  //       fs.writeFileSync(targetFile, data, { flag: 'a' });
  //       fs.unlink(fragmentPath, console.log);
  //     });
  // },

  async deleteRecord(id: string) {
    const file = await this.findFileById(id);
    file?.remove();
  },

  async getFileData(filepath: fs.PathLike) {
    return await stat(filepath);
  },

  async createRecord(data: FileInterface) {
    const file = new File(data);
    await file.save();
    return file;
  },

  async updateFileMetadata(id: string, updates: FileInterface) {
    // validate updates
    await File.findByIdAndUpdate(id, updates, { lean: true });
  },

  async findFileById(id: string) {
    return await File.findOne({ _id: id, expired: false });
  },
};
