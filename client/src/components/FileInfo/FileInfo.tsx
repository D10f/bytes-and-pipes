import React from 'react';
import shortener from '@utils/shortener';
import convertBytes from '@utils/convertBytes';

import './FileInfo.scss';

interface IFileInfoProps {
  file: File | null;
}

const FileInfo = ({ file }: IFileInfoProps) => {
  const printFileInfo = (file: File): string => {
    const name = shortener(file.name);
    const bytes = convertBytes(file.size);
    return `${name} (${bytes})`;
  };

  return (
    <label className="file-info">
      <output>
        { file && printFileInfo(file)}
        { !file && <p>No file selected</p>}
      </output>
    </label>
  );
}

export default FileInfo
