import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';

const DownloadStream = ({ isFirefox, file, decryptionKey, downloadUrl, setError }) => {

  // Signals the service worker has loaded
  const [ready, setReady] = useState(false);
  const downloadBtn = useRef(null);
  let pingSender;

  useEffect(() => {
    navigator.serviceWorker
      .register('/serviceWorkerStream.js')
      .then(downloadAsStream)
      .catch(e => setError(e.message));

    return () => {
      navigator.serviceWorker
        .getRegistrations()
        .then(reg => reg.forEach(sw => sw.unregister()))
    };
  }, []);

  const downloadAsStream = () => {
    setTimeout(() => {

      navigator.serviceWorker.controller.postMessage({
        key: decryptionKey,
        downloadUrl: downloadUrl,
        file: file,
      });

      if (isFirefox) {
        downloadBtn.current.download = file.name;

        pingSender = setInterval(() => {
          navigator.serviceWorker.controller.postMessage('ping');
        }, 10000);
      }

      setReady(true);
      // downloadBtn.current.click();

    }, 1000);
  };

  return (
    <>
      { !ready && <h3 className="download__step-title mb2">Loading...</h3> }
      <a
        className={ready ? "cta" : "is-invisible"}
        ref={downloadBtn}
        href={downloadUrl}
      >
        Start Download
      </a>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: msg => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(DownloadStream);
