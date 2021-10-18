import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import FileService from '../../../services/FileService';
import { uploadFile } from '../file';

jest.mock('../../../services/FileService');

describe('File controller test suite', () => {

  const requestMock = {
    header: (str: string) => {
      if (str === 'Content-parts') {
        return '12';
      }

      if (str === 'Content-filesize') {
        return '12582912';
      }
    },
    body: new Array(1048576), // should be Buffer type
    params: {
      filename: 'testing.txt',
      currentChunk: '8'
    }
  } as any;

  const responseMock = {
    send: jest.fn(),
    status: jest.fn(),
    json: jest.fn()
  } as any;

  const nextMock = jest.fn();

  const createTempDirectoryMock = jest.fn();
  const writeFileMock = jest.fn();
  const createRecordMock = jest.fn();

  beforeEach(() => {
    FileService.createTempDirectory = createTempDirectoryMock;
    FileService.writeFile = writeFileMock;
    FileService.createRecord = createRecordMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should succeed to process a valid file', async () => {

    createTempDirectoryMock.mockReturnValueOnce('/some/path/testing.txt');
    writeFileMock.mockReturnValueOnce(true);
    responseMock.status.mockImplementationOnce(
      (code: number) => { return responseMock }
    );

    await uploadFile(requestMock, responseMock, nextMock);

    expect(createTempDirectoryMock).toBeCalledWith('testing.txt');
    expect(writeFileMock).toBeCalled();
    expect(createRecordMock).toBeCalled();
    expect(responseMock.send).not.toBeCalled();
    expect(responseMock.status).toBeCalledWith(201);
    expect(responseMock.json).toBeCalled();
  });

});
