import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';
import useRandomPassword from '../hooks/useRandomPassword';
import DiceIcon from './icons/DiceIcon';
import EyeIcon from './icons/EyeIcon';
import EyeBlockIcon from './icons/EyeBlockIcon';
import zxcvbn from '../scripts/zxcvbn';

const actionsEnum = {
  login: 'Login',
  signup: 'Signup'
};

const passwordEnum = {
  0: 'terrible',
  1: 'poor',
  2: 'weak',
  3: 'okay',
  4: 'strong'
};

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

const Login = ({ setError }) => {

  const { login, signup } = actionsEnum;

  const generateRandomPassword = useRandomPassword(16);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [action, setAction] = useState(login);

  useEffect(() => {
    const { score } = zxcvbn(password);
    setPasswordScore(passwordEnum[score]);
  }, [password]);

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const handleClick = (e) => {
    switch (action) {
      case login:  setAction(signup); break;
      case signup: setAction(login); break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError('Please fill both email and password fields');
    }

    let url = '';

    if (action === login) {
      url = 'localhost:8080/login';
    } else {
      url = 'localhost:8080/signup';
    }

    setError(`Cannot reach ${url}`);
  };

  return (
    <motion.article
      variants={pageVariant}
      initial="initial"
      animate="visible"
      exit="initial"
      className="login"
    >
      <form
        className="login__form"
        onSubmit={handleSubmit}
      >
        <div className="login__control-group">
          <input
            onChange={handleChange}
            className="login__input"
            placeholder="Email Address"
            value={email}
            name="email"
            id="email"
          />
        </div>

        <div className="login__control-group">
          <input
            className="login__input"
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
          />
          { action === signup && (
            <button
              className="login__generate"
              type="button"
              onClick={() => setPassword(generateRandomPassword())}
            >
              { <DiceIcon /> }
            </button>
          )}
          { action === signup && (
            <span className={password ? `tooltip tooltip--${passwordScore}` : 'tooltip'}>
              {passwordScore}
            </span>
          )}
          <button
            className="login__toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            { showPassword ? <EyeBlockIcon /> : <EyeIcon /> }
          </button>
        </div>

        <button className="login__btn">
          {action}
        </button>

        <footer className="login__footer" onClick={handleClick}>
          { action === login
            ? "Don't have an account? Signup"
            : "Already have an account? Login"
          }
        </footer>
      </form>
    </motion.article>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setError: (msg) => dispatch(setError(msg))
});

export default connect(undefined, mapDispatchToProps)(Login);
