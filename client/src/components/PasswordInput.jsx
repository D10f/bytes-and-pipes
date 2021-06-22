import { useState, useEffect } from 'react';
import { generateRandomPassword } from '../scripts/crypto';
import DiceIcon from './icons/DiceIcon';
import EyeIcon from './icons/EyeIcon';
import EyeBlockIcon from './icons/EyeBlockIcon';

const passwordEnum = {
  0: 'poor',
  1: 'weak',
  2: 'average',
  3: 'okay',
  4: 'strong'
};

const PasswordInput = ({ password, setPassword, passwordSuggestions }) => {

  const [passwordScore, setPasswordScore] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  let zxcvbn;

  // 830Kb script loaded lazily when component is mounted
  if (passwordSuggestions) {
    import('zxcvbn').then(m => zxcvbn = m.default);
  }

  const getPasswordScore = (password) => {
    const { score } = zxcvbn(password);
    setPasswordScore(passwordEnum[score]);
  }

  const handleChange = (e) => {
    const { value } = e.target;

    if (passwordSuggestions) {
      getPasswordScore(value);
    }

    setPassword(value);
  };

  const handleClick = () => {
    const password = generateRandomPassword();
    getPasswordScore(password);
    setPassword(password);
  };

  // Resets password field when component unmounts
  useEffect(() => {
    return () => setPassword('');
  }, []);

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
