import { connect } from 'react-redux';
import { setPassword, toggleVisibility } from '../redux/actions/password';
import { setError } from '../redux/actions/error';
import EyeIcon from './icons/EyeIcon';
import EyeBlockIcon from './icons/EyeBlockIcon';

const FilePassword = ({ setError, password, showPassword, setPassword, toggleVisibility }) => {

  const handlePasswordInput = e => {
    setError('');
    setPassword(e.target.value);
  };

  return (
    <div className="upload-form__password">
      <input
        className="upload-form__password--input"
        onChange={handlePasswordInput}
        type={showPassword ? 'text' : 'password'}
        placeholder="Choose a strong password"
        value={password}
      />
      <button
        className="upload-form__password--toggle"
        onClick={toggleVisibility}
        type="button"
      >
        {
          showPassword ? <EyeBlockIcon /> : <EyeIcon />
        }
      </button>
    </div>
  );
;}

const mapStateToProps = (state) => ({
  ...state.password
});

const mapDispatchToProps = (dispatch) => ({
  setPassword: (password) => dispatch(setPassword(password)),
  setError: (msg) => dispatch(setError(msg)),
  toggleVisibility: () => dispatch(toggleVisibility())
});

export default connect(mapStateToProps, mapDispatchToProps)(FilePassword);
