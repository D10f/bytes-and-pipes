import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '@redux/errors/actions';
import DownloadService from '@services/DownloadService';

const useDownload = (pathname: string, fileId: string) => {

  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState(true);
  const [ downloader ] = useState(new DownloadService(pathname, fileId));

  console.log(downloader)
  console.log(downloader.downloadUrl)
  console.log(downloader.fileMetadata instanceof ArrayBuffer)

  const decryptMetadata = async (password?: string) => {
    setLoading(true);
    await downloader.decryptMetadata(password)
    setLoading(false);
  }

  useEffect(() => {
    const init = async function(){

      await downloader.fetchMetadata();

      if (downloader.hash) {
        await downloader.decryptMetadata();
      }

      setLoading(false);
    };

    init()
      .catch(err => dispatch(setError(err.message)));

  }, [ downloader ]);

  return {
    downloader,
    fileMetadata: downloader.fileMetadata,
    decryptMetadata,
    loading
  };
};

export default useDownload;
