import React, { useState } from 'react';
import Button from '@components/Button/Button';
import './UrlInput.scss';

const UrlInput = ({ url }: { url: string }) => {

  const [ copied, setCopied ] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="urlinput__container">
      <input
        className="urlinput__text"
        disabled={true}
        value={url}
      />
      <Button
        text={copied ? "Copied!" : "Copy"}
        variant="primary"
        onClick={copyToClipboard}
      />
    </div>
  );
};

export default UrlInput;
