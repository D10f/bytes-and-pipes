import fs from "fs";
import os from "os";
import path from "path";
// import stream from 'stream';
import { promisify } from 'util';
import mock from 'mock-fs';
import FileService from '../FileService';
import File from '../../models/file';

jest.mock('../../models/file');

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
  // Solved with node version 16+
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

  test('Should delete a File Document record', async () => {
    const mockFile = {
      remove: jest.fn()
    };
    File.findOne = jest.fn().mockReturnValueOnce(mockFile);
    await FileService.deleteRecord('123');
    expect(mockFile.remove).toBeCalled();
  });

  test('Should get stats for a file', async () => {
    const stats = await FileService.getFileData('/tmp/testDirectory/file1');
    expect(stats).toBeTruthy();
  });

  test('Should create a new File Document', async () => {
    const fileData = {
      name: 'test',
      encryptedMetadata: Buffer.from([ 1, 2, 3]),
      directory: '/does/not/matter',
      size: 123,
      expired: false,
      createdAt: new Date(),
    };

    const newFile = await FileService.createRecord(fileData);
    expect(File).toBeCalled();
    expect(newFile.save).toBeCalled();
  });

  test('Should update File Record encryptedMetadata field', async () => {
    const updateMock = {
      encryptedMetadata: Buffer.from([ 1, 2, 3 ])
    };

    const mockUpdateFileById = jest.fn();
    File.findByIdAndUpdate = mockUpdateFileById;
    await FileService.updateFileMetadata('123', updateMock);
    expect(mockUpdateFileById).toBeCalledWith(
      '123',
      updateMock,
      { lean: true }
    );
  });

  test('Should find a File Document by its id', async () => {

    File.findOne = jest.fn().mockReturnValueOnce({
      _id: 'hello',
      expired: true
    });

    const file = await FileService.findFileById('123');
    expect(File.findOne).toBeCalled();
    expect(file).toEqual({
      _id: 'hello',
      expired: true
    })
  });
});
