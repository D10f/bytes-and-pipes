import { useState } from 'react';
import { motion } from 'framer-motion';

const UploadForm = () => {

  const [file, setFile] = useState(undefined);
  const [error, setError] = useState(undefined);

  const handleFileChange = (e) => {
    const selected = e.target.files[0]


    if (!selected) {
      return;
    }

    if (selected.size > 1024 * 1)  {
      setError('File size cannot be greater than 100MB');
      return;
    }

    setError(undefined);
    setFile(selected);
  };

  const handleClick = () => {
    document.querySelector('#file').click();
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
  };

  return (
    <motion.form className="upload-form" onSubmit={handleFileUpload}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <label className="upload-form__label" htmlFor="file">{file ? file.name : 'No File Selected'}</label>
      <input
        className="upload-form__input"
        type="file"
        name="file"
        id="file"
        onChange={handleFileChange}
      />
      { !file && <button className="upload-form__btn" onClick={handleClick}>Select</button> }
      { file  && <button className="upload-form__btn" onClick={handleFileUpload}>Upload</button> }
      { error && <span className="upload-form__error">{error}</span> }
    </motion.form>
  );
};

export default UploadForm;
