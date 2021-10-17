import { Request } from 'express';
import FileService from '../../../services/FileService';
import { uploadFile } from '../file';

describe('File controller test suite', () => {

  test('Should succeed to process a valid file', async () => {
    const request = {
      header(str: string) {
        if (str === 'Content-parts') {
          return '12';
        }

        if (str === 'Content-filesize') {
          return '12582912';
        }
      },
      body: new Array(1048576),
      params: {
        filename: 'testing.txt',
        currentChunk: '8'
      }
    } as unknown as Request;

    // mock FileService.createTempDirectory(filename)
    // mock FileService.writeFile(p: PathLike, () => {})
    // mock FileService.readDirectory(p: PathLike)
    // mock res.send({ uploaded: currentChunk });
    // mock res.status()
    // mock res.status()
    // mock res.json({ url: newFile.downloadUrl, id: newFile._id });
  });

});