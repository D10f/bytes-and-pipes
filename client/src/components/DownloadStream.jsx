import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';

const DownloadStream = ({ isFirefox, file, decryptionKey, downloadUrl, setError }) => {

  const downloadBtn = useRef(null);
  let pingSender;

  useEffect(() => {
    navigator.serviceWorker
      .register('/serviceWorkerStream.js')
      .then(downloadAsStream)
      .catch(e => setError(e.message));
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

      downloadBtn.current.click();
    }, 1000);
  };

  return (
    <>
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
