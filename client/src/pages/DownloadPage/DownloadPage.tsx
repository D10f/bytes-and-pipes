import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useDownload from '@hooks/useDownload';
import PasswordInput from '@components/PasswordInput/PasswordInput';
import Button from '@components/Button/Button';
import FileInfo from '@components/FileInfo/FileInfo';
import DownloadStream from './components/DownloadStream';

const DownloadPage = ({ location, match }: RouteComponentProps<any>) => {

  const { downloader, fileMetadata, decryptMetadata, loading } = useDownload(location.pathname, match.params.fileId);
  const [ password, setPassword ] = useState('');

  const isEncrypted = (data: any) => data instanceof ArrayBuffer;

  return (
    <section>
      <article>
        <h1>dsfsdf</h1>
        { !fileMetadata && <p>Loading...</p>}

        { fileMetadata && isEncrypted(fileMetadata) && (
          <>
            <PasswordInput
              password={password}
              setPassword={setPassword}
              randomGen={false}
              showScore={false}
            />
            <Button
              text="Decrypt"
              variant="primary"
              disabled={loading}
              onClick={() => decryptMetadata(password)}
            />
          </>
        )}

        { fileMetadata && !isEncrypted(fileMetadata) && (
          <>
            <FileInfo file={fileMetadata as unknown as File} />
            <DownloadStream downloader={downloader} />
          </>
        )}

      </article>
    </section>
  );
};

export default DownloadPage;
