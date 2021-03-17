import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setPassword, toggleVisibility } from '../redux/actions/password';
import { setError } from '../redux/actions/error';
import useRandomPassword from '../hooks/useRandomPassword';
import zxcvbn from '../scripts/zxcvbn';
import DiceIcon from './icons/DiceIcon';
import EyeIcon from './icons/EyeIcon';
import EyeBlockIcon from './icons/EyeBlockIcon';

const passwordEnum = {
  0: 'terrible',
  1: 'poor',
  2: 'weak',
  3: 'okay',
  4: 'strong'
};

const FilePassword = ({ setError, password, showPassword, setPassword, toggleVisibility }) => {

  const generateRandomPassword = useRandomPassword(16);

  const [passwordScore, setPasswordScore] = useState('');

  useEffect(() => {
    const { score } = zxcvbn(password);
    setPasswordScore(passwordEnum[score]);
  }, [password]);

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
      <span className={password ? `tooltip tooltip--${passwordScore}` : 'tooltip'}>
        {passwordScore}
      </span>
      <button
        className="upload-form__password--generate"
        type="button"
        onClick={() => setPassword(generateRandomPassword())}
      >
        { <DiceIcon /> }
      </button>
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
