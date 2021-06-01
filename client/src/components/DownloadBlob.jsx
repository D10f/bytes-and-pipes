import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';
import ProgressOverlay from './ProgressOverlay';

const DownloadBlob = ({ swSupport, file, decryptionKey, downloadUrl, setError }) => {

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState(undefined);
  const downloadBtn = useRef(null);

  // Loads the sevice worker
  useEffect(() => {
    if (swSupport) {
      navigator.serviceWorker
        .register('/serviceWorkerBlob.js')
        .then(downloadAsBlob)
        .catch(e => setError(e.message));
    } else {
      // import decryption scripts
      // downloadfile(downloadUrl)
    }
  }, []);

  // removes the service worker when download is done
  useEffect(() => {
    if (progress >= 100) {
      navigator.serviceWorker
        .getRegistrations()
        .then(reg => reg.forEach(sw => sw.unregister()))
        .then(() => {
          URL.revokeObjectURL(blob);
          setLoading(false);
          setProgress(0);
          setBlob(undefined);
        })
        .catch(console.error);
    }

    return () => {
      navigator.serviceWorker
        .getRegistrations()
        .then(reg => reg.forEach(sw => sw.unregister()))
        .then(() => URL.revokeObjectURL(blob))
    };

  }, [progress]);

  const downloadFile = async url => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      downloadBtn.current.href = objectURL;
      setBlob(objectURL);
      // downloadBtn.current.click();
      // setTimeout(() => {
        //   URL.revokeObjectURL(objectURL);
        // }, 100);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const downloadAsBlob = () => {
    navigator.serviceWorker.addEventListener('message', event => {
      setProgress(event.data);
    });

    setTimeout(() => {
      navigator.serviceWorker.controller.postMessage({
        key: decryptionKey,
        downloadUrl: downloadUrl,
        file: file,
      });

      downloadFile(downloadUrl);
      setLoading(true);

    }, 1000);
  };

  return (
    <>
      { !blob && (
        <h3 className="download__step-title mb2">
          Loading...
        </h3>
      )}
      <a
        className={blob ? "cta" : "is-invisible"}
        ref={downloadBtn}
        download={file.name}
      >
        Start Download
      </a>
      { loading && <ProgressOverlay progress={progress} action="download" /> }
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: msg => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(DownloadBlob);
