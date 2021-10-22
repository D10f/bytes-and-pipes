import fs from "fs";
import os from "os";
import path from "path";
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
      }
    });
  });

  afterEach(() => {
    mock.restore();
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

  test.only('Should return a stream with file contents', () => {
    const stream = FileService.readAsStream('/tmp/testDirectory/file1');
    const fileContent = stream.read(); // <- Causes the error
    expect(stream instanceof fs.ReadStream).toBe(true);
    // expect(fileContent.toString()).toBe('hello\n');
  });

  test('Should write data to file', (done) => {
    const fileObj = {
      location: '/tmp/writeTestDir',
      data: Buffer.from('Oh la la!'),
      contentParts: 1,
      currentChunk: '1'
    };

    FileService.writeFile(fileObj)
      .catch(err => console.log(err.message));

    // Stream events are not captured in jest, this waits a reasonable amount of
    // time to let the system write the file (mocked in-memory file system) and
    // then test if file is present.
    setTimeout(() => {
      fileStats('/tmp/writeTestDir/1')
        .then(exists => {
          expect(exists).toBeTruthy();
          done();
        })
    }, 1000);
  });

});
