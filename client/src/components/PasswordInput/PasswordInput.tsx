import React, { useState, useEffect, EffectCallback } from 'react';
import DiceIcon from '@icons/DiceIcon';
import EyeIcon from '@icons/EyeIcon';
import EyeBlockIcon from '@icons/EyeBlockIcon';
import { generateRandomPassword } from '@utils/crypto';
import { ZXCVBNResult } from 'zxcvbn';
import './PasswordInput.scss';

enum PasswordScoreEnum {
  POOR = 'poor',
  WEAK = 'weak',
  AVERAGE = 'average',
  OKAY = 'okay',
  STRONG = 'strong',
};

interface IPasswordInputProps {
  password: string;
  setPassword: (passwd: string) => void;
  randomGen?: boolean;
  showScore?: boolean;
}

let zxcvbn: (password: string, userInputs?: string[] | undefined) => ZXCVBNResult;

const PasswordInput = ({
  password,
  setPassword,
  randomGen = true,
  showScore = true
}: IPasswordInputProps) => {

  const [ passwordScore, setPasswordScore ] = useState<PasswordScoreEnum|null>(null);
  const [ showPassword, setShowPassword ] = useState(false);

  if (showScore) {
    import('zxcvbn')
      .then(m => zxcvbn = m.default)
      .catch(err => console.error(err));
  }

  const getPasswordScore = (password: string) => {
    const { score } = zxcvbn(password);
    const map = {
      0: PasswordScoreEnum.POOR,
      1: PasswordScoreEnum.WEAK,
      2: PasswordScoreEnum.AVERAGE,
      3: PasswordScoreEnum.OKAY,
      4: PasswordScoreEnum.STRONG,
    };
    setPasswordScore(map[score]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showScore) {
      getPasswordScore(e.target.value);
    }
    setPassword(e.target.value);
  };

  const handleClick = () => {
    const password = generateRandomPassword();
    if (showScore) {
      getPasswordScore(password);
    }
    setPassword(password);
  };

  // Clears password field when component unmounts
  useEffect((): () => void => {
    return () => setPassword('');
  }, []);

  return (
    <label
      className={password ? `password__label password__label--${passwordScore}` : 'password__label'}
      data-score={password ? passwordScore : ''}
      htmlFor="password-input"
    >

      <input
        className="password__input"
        name="password-input"
        value={password}
        type={showPassword ? 'text' : 'password'}
        onChange={handleChange}
      />

      {
        randomGen && (
          <button
            className="password__generator"
            type="button"
            onClick={handleClick}
          >
            { <DiceIcon /> }
          </button>
        )
      }

      <button
        className="password__toggle"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        { showPassword ? <EyeBlockIcon /> : <EyeIcon /> }
      </button>

    </label>
  );
};

export default PasswordInput;
