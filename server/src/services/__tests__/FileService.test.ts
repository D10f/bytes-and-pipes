import fs from "fs";
import os from "os";
import path from "path";
import stream from 'stream';
import { promisify } from 'util';
import mock from 'mock-fs';
import FileService from '../FileService';

const fileStats = promisify(fs.stat);

describe('File Service test suite', () => {

  beforeEach(() => {
    // Creates an in-memory file system for testing
    mock({
      '/tmp': {},
      '/tmp/deleteTestDir': {},
      '/tmp/writeTestDir': {},
      '/tmp/testDirectory': {
        'file1': 'hello',
        'file2': 'again',
        'file3': 'world',
      },
      '/tmp/reconstruct': {
        '1': Buffer.from([ 1, 2, 3]),
        '2': Buffer.from([ 4, 5, 6 ]),
        '3': Buffer.from([ 7, 8, 8 ]),
      }
    });
  });

  afterEach(() => {
    mock.restore();
    jest.clearAllMocks();
  });

  const testFilename = 'testing.txt';
  const testFilePath = path.resolve(os.tmpdir(), testFilename);

  test('Should create a temporary directory', async () => {
    await FileService.createTempDirectory(testFilename);
    const exists = await fileStats(testFilePath);
    expect(exists).toBeTruthy();
  });

  test('Should remove a directory', async () => {
    await FileService.removeDirectory('/tmp/deleteTestDir');
    await fileStats('/tmp/deleteTestDir').catch(err => {
      expect(err.message).toBe("ENOENT, no such file or directory '/tmp/deleteTestDir'");
    })
  });

  test('Should fail to remove a non-empty directory', async () => {
    await FileService.removeDirectory('/tmp/testDirectory')
      .catch(err => {
        expect(err.message).toBe("ENOTEMPTY, directory not empty '/tmp/testDirectory'");
      })
  });

  test('Should read directory contents', async () => {
    const files = await FileService.readDirectory('/tmp/testDirectory');
    expect(files).toEqual([ 'file1', 'file2', 'file3' ]);
  });

  // Skipping due to conflict when using read and write streams in same suite while using mock-fs
  test.skip('Should return a stream with file contents', () => {
    const stream = FileService.readAsStream('/tmp/testDirectory/file1');
    expect(stream instanceof fs.ReadStream).toBe(true);
  });

  test('Should write data to file', (done) => {
    const fileObj = {
      location: '/tmp/writeTestDir',
      data: Buffer.from('Oh la la!'),
      contentParts: 1,
      currentChunk: '1'
    };

    FileService.writeFile(fileObj);

    setTimeout(() => {
      fileStats('/tmp/writeTestDir/1')
        .then(exists => {
          expect(exists).toBeTruthy();
          done();
        })
        .catch(err => {
          console.log(err.message);
          done();
        });
    }, 100);
  });

  test('Should delete a file', async () => {
    await FileService.deleteFile('/tmp/testDirectory/file2');
    await fileStats('/tmp/testDirectory/file2')
      .catch(err => {
        expect(err.message).toBe("ENOENT, no such file or directory '/tmp/testDirectory/file2'");
      });
  });

  test('Should fail to delete non-existing file', async () => {
    await FileService.deleteFile('/tmp/testDirectory/file2')
    .catch(err => {
      expect(err.message).toBe("ENOENT, no such file or directory '/tmp/testDirectory/file2'");
    });
  });

  test('Should produce an array of read streams one file out of many', async () => {
    jest.spyOn(fs, 'createReadStream').mockImplementation(
      (fragment: any): any => {
        return Buffer.from(fragment);
      }
    )

    const streams = await FileService.reconstructRecord({ directory: '/tmp/reconstruct' });
    expect(streams.length).toBe(3);
    // expect(streams[0]).toBe(expect.any(Buffer));
  });
});
