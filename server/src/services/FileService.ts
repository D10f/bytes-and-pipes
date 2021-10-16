import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import File from '../models/file';

import { FileInterface } from '../interfaces';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

export default {
  async createTempDirectory(dirName: fs.PathLike): Promise<fs.PathLike> {
    const location = path.resolve(os.tmpdir(), dirName as string);
    await this.createDirectory(location);
    return location;
  },

  async createDirectory(filepath: fs.PathLike, recursive: boolean = true) {
    await mkdir(filepath, { recursive });
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

  writeFile(filepath: fs.PathLike, data: any, callback = (err?: Error) => {}) {
    const writer = fs.createWriteStream(filepath);
    writer.write(data);
    writer.on("close", callback);
  },

  async deleteFile(filepath: fs.PathLike) {
    await unlink(filepath);
  },

  async deleteRecord(id: string) {
    const file = await this.findFileById(id);
    file?.remove();
  },

  async getFileData(filepath: fs.PathLike) {
    return await stat(filepath);
  },

  async saveNewFile(data: FileInterface) {
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
