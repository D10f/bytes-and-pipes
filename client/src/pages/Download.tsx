import { useState } from 'react';
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

const Download = ({ location, history }) => {

  const [fileId, setFileId]               = useState(location.pathname.match(/\/d\/(\w*)(#\w*)?$/i)[1]);
  const [hash, setHash]                   = useState(location.hash.slice(1));
  const [decryptionKey, setDecryptionKey] = useState(undefined);
  const [fileMetadata, setFileMetadata]   = useState(undefined);

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
        { !fileMetadata &&
          <DownloadMetadata
            fileId={fileId}
            hash={hash}
            setFileMetadata={setFileMetadata}
            setDecryptionKey={setDecryptionKey}
            history={history}
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
