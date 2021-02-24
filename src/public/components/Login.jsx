import { useState } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { setError } from '../redux/actions/error';
import EyeIcon from './icons/EyeIcon';
import EyeBlockIcon from './icons/EyeBlockIcon';

const actionsEnum = {
  login: 'Login',
  signup: 'Signup'
};

const Login = ({ setError }) => {

  const { login, signup } = actionsEnum;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [action, setAction] = useState(login);

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
    <motion.article className="login"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
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
