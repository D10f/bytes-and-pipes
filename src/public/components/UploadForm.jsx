import { useState } from 'react';
import { motion } from 'framer-motion';
import useCrypto from '../hooks/useCrypto';
import FileInfo from './FileInfo';
import SVGEye from './SVGEye';
import SVGEyeBlock from './SVGEyeBlock';

const UploadForm = () => {

  const [file, setFile] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(undefined);

  const handleFileChange = (e) => {
    const selected = e.target.files[0]


    if (!selected) {
      return;
    }

    if (selected.size > 1024 * 1024 * 100)  {
      setError('File size cannot be greater than 100MB');
      return;
    }

    setError(undefined);
    setFile(selected);
  };

  const handleClick = () => {
    document.querySelector('#file').click();
  };

  const handlePassword = (e) => {
    const value = e.target.value;

    if (error) setError(undefined);

    setPassword(value);
  };

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();

    if (!password) {
      setError('You must type in a password!');
      return;
    }
  };

  return (
    <motion.form className="upload-form" onSubmit={handleFileUpload}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <label className="upload-form__label" htmlFor="file">
        {file ? <FileInfo file={file} /> : 'No File Selected'}
      </label>
      <input
        className="upload-form__input"
        type="file"
        name="file"
        id="file"
        onChange={handleFileChange}
      />
      { !file && <button className="upload-form__btn" type="button" onClick={handleClick}>Select</button> }
      {
        file &&
        <div className="upload-form__password">
          <input
            className="upload-form__password--input"
            onChange={handlePassword}
            type={showPassword ? 'text' : 'password'}
            placeholder="Choose a strong password"
          />
          <button
            className="upload-form__password--toggle"
            onClick={handleToggle}
            type="button"
          >
            {
              showPassword ? <SVGEyeBlock /> : <SVGEye />
            }
          </button>
        </div>
      }
      { file  && <button className="upload-form__btn" type="button" onClick={handleFileUpload}>Upload</button> }
      { error && <output className="upload-form__error">{error}</output> }
    </motion.form>
  );
};

export default UploadForm;

// <button
//   className="upload-form__password--toggle"
//   onClick={() => setShowPassword(!showPassword)}
//   type="button"
// >
// </button>
