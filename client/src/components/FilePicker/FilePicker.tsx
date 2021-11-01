import React, { useRef } from 'react';
import Button from '@components/Button/Button';
import './FilePicker.scss';

interface IFilePickerProps {
  file: File | null;
  handleFileChange: (f: File) => void
}

const FilePicker = ({ file, handleFileChange }: IFilePickerProps) => {

  const inputRef = useRef<HTMLInputElement | null>(null);

  const checkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  return (
    <>
      <input
        className="file-picker__input"
        ref={inputRef}
        type="file"
        name="file"
        id="file"
        onChange={checkFile}
      />
      <Button
        text={file ? "Change File" : "Select"}
        variant="primary"
        onClick={() => inputRef.current?.click()}
      />
    </>
  );
};

export default FilePicker;
