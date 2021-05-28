import DownloadStream from './DownloadStream';
import DownloadBlob from './DownloadBlob';

const DownloadOptions = ({ file, decryptionKey, downloadUrl }) => {

  /*
  The WHATWG standard defines download links as synchronous requests that should
  be intercepted by Service Workers. However as of this writing Chromium-based
  browsers don't adhere to this standard. To workaround that we removed the
  "download" attribue from the anchor element, but this introduces new problems.
  First, the name of the file downloaded cannot be prefilled for the user. And
  secondly, the browser attempts to open the file if it's supported, instead of
  downloading it which is not the intention of the application.

  Both issues are very easy to navigate around but it can lead to confusion and
  frustration due to poor user experience. As a workaround to both these issues
  smaller files will be downloaded from the server, decrypted in the browser and
  then downloaded from the resulting blob. For small files this inefficiency is
  hardly noticeable and will improve user experience.

  For this reasons we recommend using Firefox for downloading files.

  Source:
    https://html.spec.whatwg.org/multipage/links.html#downloading-resources
    https://w3c.github.io/ServiceWorker/#service-worker-global-scope-fetch-event
    https://stackoverflow.com/a/54319282/15164352
  */

  // TODO: come up with a better and more reliable method to tell browsers apart
  const isFirefox = !window.TransformStream;
  const swSupport = 'serviceWorker' in navigator;
  const largeFile = file.size > 104857600;

  console.log(decryptionKey);

  if ( swSupport && (isFirefox || largeFile) ) {
    return (
      <DownloadStream
        file={file}
        isFirefox={isFirefox}
        decryptionKey={decryptionKey}
        downloadUrl={downloadUrl}
      />
    );
  }

  return (
    <DownloadBlob
      file={file}
      swSupport={swSupport}
      decryptionKey={decryptionKey}
      downloadUrl={downloadUrl}
    />
  );
};

export default DownloadOptions;
