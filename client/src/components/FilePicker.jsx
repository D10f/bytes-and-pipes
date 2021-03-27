import { useRef } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';

const FilePicker = ({ file, setFile, setError }) => {

  const inputEl = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0]

    if (!selected) {
      return;
    }

    if (selected.size > 1024 * 1024 * 1024)  {
      setError('File size cannot be greater than 1GB');
      return;
    }

    setError(null);
    setFile(selected);
  };

  return (
    <>
      <input
        ref={inputEl}
        onChange={handleFileChange}
        type="file"
        name="file"
        id="file"
        className="upload-form__input"
      />
      {
        !file &&
        <button
          className="upload-form__btn"
          type="button"
          onClick={() => inputEl.current.click()}
        >
          Select
        </button>
      }
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(FilePicker);
