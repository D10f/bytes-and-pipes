import { useState } from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { setError } from '../redux/actions/error';
import { setFile } from '../redux/actions/file';

import FileInfo from './FileInfo';
import FilePassword from './FilePassword';
import FilePicker from './FilePicker';

const pageVariant = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
};

const UploadForm = ({ file, error, password, setError, setFile }) => {

  const [dragged, setDragged] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    // If no file was dropped, do nothing
    if (!file) return;

    if (file.size > 1024 * 1024)  {
      setError('File size cannot be greater than 1MB');
      return;
    }

    setFile(file);
    setDragged(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragged(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragged(false);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();

    if (!password) {
      setError('You must type in a password!');
      return;
    }
  };

  return (
    <motion.form
      className={dragged ? "upload-form upload-form--dragged" : "upload-form"}
      onSubmit={handleFileUpload}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      variants={pageVariant}
      initial="initial"
      animate="visible"
      exit="initial"
    >
      <FileInfo file={file} />
      <FilePicker />
      { file && <FilePassword /> }
      { file && <button className="upload-form__btn" type="button" onClick={handleFileUpload}>Upload</button> }
    </motion.form>
  );
};

const mapStateToProps = (state) => ({
  file: state.file,
  error: state.error,
  password: state.password.password
});

const mapDispatchToProps = (dispatch) => ({
  setFile: (file) => dispatch(setFile(file)),
  setError: (msg) => dispatch(setError(msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);

// { error && <output className="upload-form__error">{error}</output> }
