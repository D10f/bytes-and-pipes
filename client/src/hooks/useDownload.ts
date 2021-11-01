import { useState, useEffect } from 'react';
import DownloadService from '@services/DownloadService';

const useDownload = (location: any) => {

  const [ downloader ] = useState(new DownloadService(location.pathname));
  const [ progress, setProgress ] = useState(0);
  const [ error, setError ] = useState('');

  useEffect(() => {
    const init = async function(){
      await downloader.fetchMetadata()
      await downloader.decryptMetadata();
    };
    init()
      .catch(err => setError(err.message));
  }, []);

  return {
    downloader,
    progress,
    error,
  };
};

export default useDownload;
