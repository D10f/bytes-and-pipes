import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useDownload from '@hooks/useDownload';
import PasswordInput from '@components/PasswordInput/PasswordInput';
import Button from '@components/Button/Button';
import FileInfo from '@components/FileInfo/FileInfo';
import DownloadStream from './components/DownloadStream';

/**
 * Possible states are:
 *  1) fetching metadata
 *  2) no password provided via url fragment (ask user for input)
 *  3) all set, ready to start download
 */

const DownloadPage = ({ location }: RouteComponentProps) => {

  const { downloader } = useDownload(location);
  const [ password, setPassword ] = useState('');

  return (
    <section className="">
      <article>

        {downloader && !downloader.fileMetadata && <p>Loading...</p>}

        {downloader && !downloader.hasKey && (
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
              onClick={() => downloader!.decryptMetadata(password)}
            />
          </>
        )}

        {downloader && downloader.hasKey && downloader.fileMetadata && (
          <>
            <FileInfo file={downloader.fileMetadata as unknown as File} />
            <DownloadStream downloader={downloader} />
          </>
        )}

      </article>
    </section>
  );
};

export default DownloadPage;
