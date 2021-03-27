import { useState } from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { setError } from '../redux/actions/error';
import FileInfo from './FileInfo';
import FilePicker from './FilePicker';
import PasswordInput from './PasswordInput';
import encryptionStream from '../scripts/encryptionStream';

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

const UploadForm = ({ authToken, error, setError }) => {

  const [dragged, setDragged] = useState(false);
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    // If no file was dropped, do nothing
    if (!file) return;

    if (file.size > 1024 * 1024 * 1024)  {
      setError('File size cannot be greater than 1GB');
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

    if (!file) {
      setError('You must select a file to upload!');
      return;
    }

    if (!password) {
      setError('You must type in a password!');
      return;
    }

    encryptionStream(file, password, authToken);
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
      <FilePicker file={file} setFile={setFile} />
      { file && <PasswordInput
        password={password}
        setPassword={setPassword}
        passwordSuggestions={true}
      /> }
      { file && <button className="upload-form__btn" type="submit">Upload</button> }
    </motion.form>
  );
};

const mapStateToProps = (state) => ({
  authToken: state.user.jwt,
  error: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);

// { error && <output className="upload-form__error">{error}</output> }
