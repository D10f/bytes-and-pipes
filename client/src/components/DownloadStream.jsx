import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';
import WarningMsg from './WarningMsg';

const DownloadStream = ({ isFirefox, file, decryptionKey, downloadUrl, setError }) => {

  const downloadBtn = useRef(null);

  useEffect(() => {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(downloadAsStream)
      .catch(e => setError(e.message));
  }, []);

  const downloadAsStream = () => {
    setTimeout(() => {
      navigator.serviceWorker.controller.postMessage({
        key: decryptionKey,
        downloadUrl: downloadUrl,
        file: file
      });

      if (isFirefox) {
        downloadBtn.current.download = file.name;
      }

      downloadBtn.current.click();
    }, 5000);
  };

  return (
    <>
      <p>Stream</p>
      <p>{isFirefox ? 'firefox' : 'chromium'}</p>
      <h3 className="download__step-title mb2">Your download will start shortly...</h3>
      <a
        ref={downloadBtn}
        href={downloadUrl}
      />
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: msg => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(DownloadStream);
