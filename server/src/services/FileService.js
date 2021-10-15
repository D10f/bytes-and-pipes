import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import { updateFileMetadata } from "../api/controllers/file";

import File from '../models/file';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

export default {
  async createTempDirectory(dirName) {
    const location = path.resolve(os.tmpdir(), dirName);
    await this.createDirectory(location);
    return location;
  },

  async createDirectory(path, recursive = true) {
    await mkdir(path, { recursive });
  },

  async removeDirectory(path) {
    await rmdir(path);
  },

  async readDirectory(path) {
    return await readdir(path);
  },

  writeFile(path, data, callback = () => {}) {
    const writer = fs.createWriteStream(path);
    writer.write(data);
    writer.close(callback);
  },

  async deleteFile(path) {
    await unlink(path);
  },

  async getFileData(path) {
    return await stat(path);
  },

  async saveNewFile(data) {
    await new File(data).save();
    
  },

  async updateFileMetadata(id, updates) {
    // validate updates
    await File.findByIdAndUpdate(id, updates, { lean: true });
  }
};
