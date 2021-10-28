import { useState } from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { setError } from '../redux/actions/error';
import { setUrl } from '../redux/actions/url';
import Button from './Button';
import FileInfo from './FileInfo';
import FilePicker from './FilePicker';
import PasswordInput from './PasswordInput';
import ProgressOverlay from './ProgressOverlay';
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

const UploadForm = ({ authToken, error, setError, url, setUrl }) => {

  const [dragged, setDragged] = useState(false);
  const [passwordStrategy, setPasswordStrategy] = useState(false);
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

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

  const reset = () => {
    setDragged(false);
    setPassword('');
    setProgress(0);
    setLoading(false);
    setFile(null);
    setUrl('');
    setError('');
  };

  const togglePasswordStrategy = () => {
    setPasswordStrategy(!passwordStrategy);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();

    if (!file) {
      setError('You must select a file to upload!');
      return;
    }

    if (passwordStrategy && !password) {
      setError('You must type in a password!');
      return;
    }

    setLoading(true);

    encryptionStream(file, password, authToken, setError, setProgress, (url) => {
      setFile(null);
      setPassword('');
      setError('');
      setUrl(url);
    });
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
      {
        file && passwordStrategy && (
        <PasswordInput
          password={password}
          setPassword={setPassword}
          passwordSuggestions={true}
        />
      )}
      { file && (
        <div className="upload-form__control-group">
          <Button text="Upload" />
          <span>or</span>
          <span
            className="upload-form__switch"
            onClick={togglePasswordStrategy}
          >
            {passwordStrategy ? 'Encrypt without password' : 'Encrypt with password' }
          </span>
        </div>
      )}
      { (loading || url) && <ProgressOverlay progress={progress} reset={reset} action="upload" />}
    </motion.form>
  );
};

const mapStateToProps = (state) => ({
  authToken: state.user.jwt,
  error: state.error,
  url: state.url
});

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg)),
  setUrl: (url) => dispatch(setUrl(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);

// { error && <output className="upload-form__error">{error}</output> }
