import stream from 'stream';
import FileService from '../../../services/FileService';
import { BadRequestError } from '../../../services/ErrorService';
import { uploadFile, updateFileMetadata, downloadFile, readFileMetadata } from '../file';

jest.mock('../../../services/FileService');
// jest.mock('stream');

describe('File controller test suite', () => {

  const requestMock = {
    body: new Array(1048576), // should be Buffer type
    params: {
      filename: 'testing.txt',
      currentChunk: '8',
      id: 'someid'
    },
    header: jest.fn()
  } as any;

  const responseMock = {
    send: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
    set: jest.fn()
  } as any;

  const nextMock = jest.fn();

  const createTempDirectoryMock = jest.fn();
  const writeFileMock = jest.fn();
  const createRecordMock = jest.fn();
  const updateFileMetadataMock = jest.fn();
  const findFileByIdMock = jest.fn();
  const reconstructRecordMock = jest.fn();
  const deleteRecordMock = jest.fn();

  beforeEach(() => {
    FileService.createTempDirectory = createTempDirectoryMock;
    FileService.writeFile = writeFileMock;
    FileService.createRecord = createRecordMock;
    FileService.updateFileMetadata = updateFileMetadataMock;
    FileService.findFileById = findFileByIdMock;
    FileService.reconstructRecord = reconstructRecordMock;
    FileService.deleteRecord = deleteRecordMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should succeed to process a valid file', async () => {

    requestMock.header.mockImplementation(
      (str: string) => {
        return str === 'Content-parts' ? '12' : '12582912';
      }
    );

    createTempDirectoryMock.mockReturnValueOnce('/some/path/testing.txt');
    writeFileMock.mockReturnValueOnce(true);
    responseMock.status.mockReturnValueOnce(responseMock);

    await uploadFile(requestMock, responseMock, nextMock);

    expect(createTempDirectoryMock).toBeCalledWith('testing.txt');
    expect(writeFileMock).toBeCalled();
    expect(createRecordMock).toBeCalled();
    expect(responseMock.send).not.toBeCalled();
    expect(responseMock.status).toBeCalledWith(201);
    expect(responseMock.json);
  });

  test('Should fail to upload file due to missing headers', async () => {
    requestMock.header.mockReturnValue(undefined);
    await uploadFile(requestMock, responseMock, nextMock);
    expect(nextMock).toBeCalledWith(new BadRequestError('Missing required headers.'));
  });

  test('Should fail to upload file due to exceeding max file size', async () => {
    requestMock.header.mockReturnValue(Number.MAX_SAFE_INTEGER);
    await uploadFile(requestMock, responseMock, nextMock);
    expect(nextMock).toBeCalledWith(new BadRequestError("Files larger than 1GB are not allowed."));
  });

  test('Should fail to upload file due to req body larger than reported file size', async () => {
    // Example file of 28MB (28829003) using 1MB (1048576) file chunks
    requestMock.header.mockImplementation(
      (str: string) => {
        return str === 'Content-parts' ? '28' : '28829003';
      }
    );
    // 64 bytes per chunk: 32 salt, 16 IV and 16 AEAD
    // 1: Test fails if body greater than, so add one to exceed that
    requestMock.body = new Array((28 * 64) + 28829003 + 1)
    await uploadFile(requestMock, responseMock, nextMock);
    expect(nextMock).toBeCalledWith(new BadRequestError("File is larger than reported size."));
  });

  test('Should call next upon error returned', async () => {
    createTempDirectoryMock.mockRejectedValueOnce('Some error');
    requestMock.header.mockImplementation(
      (str: string) => {
        return str === 'Content-parts' ? '28' : '28829003';
      }
    );
    await uploadFile(requestMock, responseMock, nextMock);
    expect(writeFileMock).not.toBeCalled();
    expect(nextMock).toBeCalled();
  });

  test('Should update file metadata', async () => {
    await updateFileMetadata(requestMock, responseMock, nextMock);
    expect(updateFileMetadataMock).toBeCalledWith(requestMock.params.id, {
      encryptedMetadata: requestMock.body
    });
    expect(responseMock.status).toBeCalledWith(202);
  });

  test('Should fail to update file metadata due to missing request body', async () => {
    requestMock.body = undefined;
    await updateFileMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toBeCalledWith(new BadRequestError("Missing required body content."));
    expect(updateFileMetadataMock).not.toBeCalled();
  });

  test('Should fail to update file metadata due to error thrown', async () => {
    updateFileMetadataMock.mockRejectedValueOnce('Some error');
    await updateFileMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toBeCalled();
    expect(responseMock.status).not.toBeCalled();
  });

  test('Should start a file download', async () => {
    const mockFile = {
      name: 'test',
      directory: '/dev/null',
      size: 28829003,
    };

    findFileByIdMock.mockReturnValueOnce(mockFile);

    jest.spyOn(stream, 'pipeline').mockImplementationOnce(
      (_a: any, _b: any, _c: any ): any => {}
    );

    await downloadFile(requestMock, responseMock, nextMock);
    expect(responseMock.set).toBeCalledWith("Content-Type", "application/octet-stream");
    expect(reconstructRecordMock).toBeCalledWith(mockFile);
    expect(deleteRecordMock).not.toBeCalled();
  });

  test('Should fail start a file download at pipeline', async () => {
    const mockFile = {
      _id: '123',
      name: 'test',
      directory: '/dev/null',
      size: 28829003,
    };

    findFileByIdMock.mockReturnValueOnce(mockFile);

    jest.spyOn(stream, 'pipeline').mockImplementationOnce(
      (_a: any, _b: any, cb: any ): any => { cb('error') }
    );

    await downloadFile(requestMock, responseMock, nextMock);
    expect(responseMock.set).toBeCalledWith("Content-Type", "application/octet-stream");
    expect(reconstructRecordMock).toBeCalledWith(mockFile);
    expect(nextMock).toBeCalled();
    expect(deleteRecordMock).toBeCalledWith(mockFile._id);
  });

  test('Should fail to find a file with provided id', async () => {
    findFileByIdMock.mockReturnValueOnce(undefined);
    await downloadFile(requestMock, responseMock, nextMock);
    expect(nextMock).toBeCalledWith(new BadRequestError('No file found with that id.'));
    expect(responseMock.set).not.toBeCalled();
  });

  test('Should read file metadata', async () => {
    const mockFile = {
      _id: '123',
      name: 'test',
      directory: '/dev/null',
      size: 28829003,
      encryptedMetadata: 'metadata'
    };

    findFileByIdMock.mockReturnValueOnce(mockFile);
    await readFileMetadata(requestMock, responseMock, nextMock);
    expect(responseMock.send).toBeCalledWith('metadata');
  });
});
