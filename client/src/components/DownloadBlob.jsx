import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';
import WarningMsg from './WarningMsg';

const DownloadBlob = ({ swSupport, file, decryptionKey, downloadUrl, setError }) => {

  const downloadBtn = useRef(null);

  useEffect(() => {
    if (swSupport) {
      navigator.serviceWorker
        .register('/serviceWorker.js')
        .then(downloadAsBlob)
        .catch(e => setError(e.message));
    } else {
      // import decryption scripts
      // downloadfile(downloadUrl)
    }
  }, []);

  const downloadFile = async url => {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    downloadBtn.current.href = objectURL;
    downloadBtn.current.click();
    setTimeout(() => {
      URL.revokeObjectURL(objectURL);
    }, 100);
  };

  const downloadAsBlob = () => {
    setTimeout(() => {
      navigator.serviceWorker.controller.postMessage({
        key: decryptionKey,
        downloadUrl: downloadUrl,
        file: file
      });

      downloadFile(downloadUrl);

    }, 5000);
  };

  return (
    <>
      <p>Blob</p>
      <h3 className="download__step-title mb2">Your download will start shortly...</h3>
      <a
        ref={downloadBtn}
        download={file.name}
      ></a>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: msg => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(DownloadBlob);
