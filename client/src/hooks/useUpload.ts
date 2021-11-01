import { useState, useEffect } from 'react';
import UploadService from '@services/UploadService';

interface PostResponseObject {
  url: string | undefined;
  progress: number;
}

/**
 * Creates a new encryption stream (from the UploadService) and iterates over
 * it until completion. Returns the progress of the upload and the final url.
 */
const useUpload = (file: File, password: string | null) => {
  const [ progress, setProgress ] = useState(0);
  const [ url, setUrl ] = useState<string|null>(null);
  const [ error, setError ] = useState<string|null>(null);

  useEffect(() => {
    // Define async function
    const startEncryptionStream = async () => {
      const Uploader = new UploadService(file);

      if (password) {
        await Uploader.withPassword(password);
      } else {
        await Uploader.withRandomKey();
      }

      let response: PostResponseObject;
      for await (response of Uploader.createEncryptionStream()) {
        setProgress(response.progress);
      }

      if (!error) {
        const url = await Uploader.encryptMetadata();
        setUrl(url);
      }
    };

    // Call it
    startEncryptionStream()
      .catch(err => setError(err.message));

  }, [ file ]);

  return { progress, url, error };
};

export default useUpload;
