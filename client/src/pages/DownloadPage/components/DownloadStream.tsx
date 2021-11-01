import React, { useState, useEffect, useRef } from 'react';
import DownloadService from '@services/DownloadService';

interface IProps {
  downloader: DownloadService;
  setProgress?: (num: number) => void;
  setError?: (str: string) => void;
}

const DownloadStream = ({ downloader }: IProps) => {

  const downloadBtn = useRef(null);
  const [ ready, setReady ] = useState(false);

  useEffect(() => {
    downloader.startDownloadStream()
      .then(() => {
        setTimeout(() => {
          setReady(true);
        }, 1000);
      })
      .catch(err => console.error(err.message));

    return downloader.tearDownStream;
  }, []);

  return (
    <a
      className={ready ? "btn--action" : "is-hidden"}
      ref={downloadBtn}
      href={downloader.downloadUrl}
    >
      Start Download
    </a>
  );
};

export default DownloadStream;
