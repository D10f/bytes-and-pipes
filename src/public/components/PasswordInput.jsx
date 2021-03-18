import { useState } from 'react';
import useRandomPassword from '../hooks/useRandomPassword';
import DiceIcon from './icons/DiceIcon';
import EyeIcon from './icons/EyeIcon';
import EyeBlockIcon from './icons/EyeBlockIcon';
import zxcvbn from '../scripts/zxcvbn';

const passwordEnum = {
  0: 'poor',
  1: 'weak',
  2: 'average',
  3: 'okay',
  4: 'strong'
};

const PasswordInput = ({ password, setPassword, passwordSuggestions }) => {

  const generateRandomPassword = useRandomPassword(16);
  const [passwordScore, setPasswordScore] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getPassScore = (password) => {
    const { score } = zxcvbn(password);
    setPasswordScore(passwordEnum[score]);
  }

  const handleChange = (e) => {
    const { value } = e.target;

    if (passwordSuggestions) {
      getPassScore(value);
    }

    setPassword(value);
  };

  const handleClick = () => {
    const password = generateRandomPassword();
    getPassScore(password);
    setPassword(password);
  };

  return (
    <div className="login__control-group">
      <input
        className={passwordSuggestions && password ? `login__input login__input--${passwordScore}` : 'login__input'}
        onChange={handleChange}
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={password}
      />
      { passwordSuggestions && (
        <button
          className="login__generate"
          type="button"
          onClick={handleClick}
        >
          { <DiceIcon /> }
        </button>
      )}
      <button
        className="login__toggle"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        { showPassword ? <EyeBlockIcon /> : <EyeIcon /> }
      </button>
    </div>
  );
};

export default PasswordInput;
