import { useState, useEffect, useRef } from 'react';

import FileInfo from './FileInfo';

const DownloadFile = ({ file, downloadUrl }) => {

  const [progress, setProgress] = useState(0);
  const downloadBtn = useRef(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then(() => {
          downloadBtn.current.click();
        })
        .catch(console.error);
    }
  }, [file])

  return (
    <>
      <h3 className="download__step-title mb2">Downloading file, do not close this window</h3>
      <FileInfo file={file} />
      <a
        ref={downloadBtn}
        className="download__step-link"
        href={downloadUrl}
        download
      />
    </>
  );
};

export default DownloadFile;
