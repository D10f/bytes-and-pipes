import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FileInfo from '../FileInfo';
import DownloadMetadata from '../DownloadMetadata';
import DownloadOptions from '../DownloadOptions';

const pageVariant = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
};

const Download = ({ location }) => {

  const [decryptionKey, setDecryptionKey] = useState(false);
  const [fileMetadata, setFileMetadata]   = useState(undefined);
  const [fileId, setFileId]               = useState(undefined);
  const [fileError, setFileError]         = useState(undefined);

  useEffect(() => {
    const id = location.pathname.match(/\/d\/(\w*)$/i)[1];
    setFileId(id);

    fetch(`http://localhost:3000/d/meta/${id}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('File does not exist or has expired.');
        }
        res.arrayBuffer().then(buffer => setFileMetadata(buffer));
      })
      .catch(err => {
        setFileError(err);
      })
  }, []);

  // 1. Check URL. File exists ? proceed : error.
  // 2. Check key required, take user input if needed. Attempt to decrypt fileMetadata. Success ? proceed : error.
  // 3. Span service worker, provide it with decryption key. Start download/decryption stream.

  return (
    <motion.section
      variants={pageVariant}
      initial="initial"
      animate="visible"
      exit="initial"
    >
      <motion.article
        initial="initial"
        animate="visible"
        exit="initial"
        className="download"
      >
        { !fileMetadata && (
          fileError
            ? <p>Something went wrong... {fileError}</p>
            : <p>Loading...</p>
        )}
        { (fileMetadata && !decryptionKey) &&
          <DownloadMetadata
            fileMetadata={fileMetadata}
            setFileMetadata={setFileMetadata}
            decryptionKey={decryptionKey}
            setKey={setDecryptionKey}
            path={location.pathname}
          />
        }
        {
          (fileMetadata && decryptionKey) &&
          <>
            <FileInfo file={fileMetadata} />
            <DownloadOptions
              file={fileMetadata}
              decryptionKey={decryptionKey}
              downloadUrl={`http://localhost:3000/download/${fileId}`}
            />
          </>
        }
      </motion.article>
    </motion.section>
  );
};

export default Download;
