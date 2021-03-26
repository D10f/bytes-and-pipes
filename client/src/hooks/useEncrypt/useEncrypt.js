import { useState, useEffect } from 'react';
import encryptionStream from './encryptionStream';

const useEncrypt = (file, password) => {

  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);
  const startEncryptionStream = encryptionStream(file, password, setProgress, setUrl);

  useEffect(() => {

    startEncryptionStream.next();

  }, [progress]);

  return { progress, url };
};

export default useEncrypt;
